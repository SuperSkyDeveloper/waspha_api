const notification = global.notification;

module.exports = {
  friendlyName: "Create proposal",

  description: "",

  inputs: {
    vendor: {
      type: "ref",
      required: true,
      description: "logged in vendor",
    },
    rfp_id: {
      type: "number",
      required: true,
    },
    delivery_mode_id: {
      type: "number",
      required: false,
      allowNull: true,
    },
    delivery_vehicle_id: {
      type: "number",
      required: false,
      allowNull: true,
    },
    delivery_fee: {
      type: "number",
      required: false,
      defaultsTo: 0,
    },
    eta: {
      type: "string",
      required: false,
    },
    proposal_prep_time: {
      type: "number",
      required: false,
    },
    proposal_selection_time: {
      type: "number",
      required: false,
    },
    items: {
      type: "json",
      required: true,
    },
  },

  exits: {
    serverError: {
      description: "send server error",
      responseType: "serverError",
    },
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action vendor/create-proposal");

    const statuses = await sails.helpers.getAllStatuses();
    let query = `
      SELECT rfp.id,rfp.user_id,rfp.type,rfp.status_id,rfp_store.is_specific
      FROM request_for_proposals rfp    
      INNER JOIN request_for_proposal_store rfp_store
        ON rfp_store.rfp_id = rfp.id
    
      WHERE rfp_store.store_id = ${inputs.vendor.store.id}
      AND rfp.id = ${inputs.rfp_id}
      AND rfp.status_id NOT IN(${statuses.rejected},${statuses.deleted},${statuses.closed})
    
    `;
    let result = await sails.sendNativeQuery(query);
    const attachedRfp = await sails.models.request_for_proposal_store.findOne({
      and: [{ rfp_id: inputs.rfp_id }, { store_id: inputs.vendor.store.id }],
    });
    if (!result.rows.length) {
      sails.log.warn(
        "Invalid rfp id or rfp does not belong to current vendor's store"
      );
      return exits.ok({
        status: false,
        message: sails.config.strings.en.INVALID_RFP_ID,
        data: [],
      });
    }
    if (result.rows[0].status_id == statuses.expired) {
      sails.log.warn("RFP has been expired");
      return exits.ok({
        status: false,
        message: sails.config.strings.en.RFP_HAS_BEEN_EXPIRED,
        data: [],
      });
    }
    if (result.rows[0].status_id == statuses.cancelled) {
      sails.log.warn("RFP has been cancelled");
      return exits.ok({
        status: false,
        message: sails.config.strings.en.RFP_HAS_BEEN_CANCELLED,
        data: [],
      });
    }
    let user_id = result.rows[0].user_id;
    let rfp_type = result.rows[0].type;
    let is_specific = result.rows[0].is_specific;
    const already_sent = await Proposal.find({
      where: { rfp_store_id: attachedRfp.id },
    }).limit(1);

    if (already_sent.length && already_sent[0].status_id != null) {
      sails.log.warn(
        `A proposal of current vendor for rfp_id ${attachedRfp.rfp_id} already exists`
      );
      return exits.ok({
        status: false,
        message: sails.config.strings.en.PROPOSAL_ALREADY_EXITS,
        data: [],
      });
    }

    if (rfp_type == global.RFP_TYPE.DELIVERY) {
      if (
        _.isUndefined(inputs.delivery_mode_id) ||
        _.isUndefined(inputs.delivery_vehicle_id)
      ) {
        sails.log.warn(
          `Type of rfp id '${attachedRfp.rfp_id}' is delivery so delivery mode & delivery vehicle must be provided`
        );
        return exits.ok({
          status: false,
          message:
            sails.config.strings[inputs.vendor.language]
              .DELIVERY_MODE_AND_DELIVERY_VEHICLE_REQUIRED,
          data: [],
        });
      }
    }
    const rfp_id = inputs.rfp_id;
    const delivery_mode_id = inputs.delivery_mode_id || null;
    const delivery_vehicle_id = inputs.delivery_vehicle_id || null;
    const delivery_fee = !_.isUndefined(inputs.delivery_fee)
      ? inputs.delivery_fee
      : null;
    const proposal_prep_time = !_.isUndefined(inputs.proposal_prep_time)
      ? inputs.proposal_prep_time
      : null;
    const proposal_selection_time = !_.isUndefined(
      inputs.proposal_selection_time
    )
      ? inputs.proposal_selection_time
      : null;
    const eta = !_.isUndefined(inputs.eta) ? inputs.eta : null;

    const items = inputs.items;

    const rec = {
      rfp_store_id: attachedRfp.id,
      delivery_mode_id: delivery_mode_id,
      delivery_vehicle_id: delivery_vehicle_id,
      eta: eta,
      type: rfp_type,
      proposal_prep_time: proposal_prep_time,
      proposal_selection_time: proposal_selection_time,
    };
    if (delivery_fee) {
      rec.delivery_fee = delivery_fee;
    }

    //rec.status_id = statuses.pending;
    sails.log("creating proposal");
    let proposal = null;
    if (!_.isUndefined(already_sent[0]) && already_sent[0].status_id == null) {
      proposal = await Proposal.updateOne({ id: already_sent[0].id }).set(rec);
      await Proposal_item.destroy({ proposal_id: already_sent[0].id });
    } else {
      proposal = await Proposal.create(rec).fetch();
    }

    if (proposal.id) {
      sails.log("Proposal created, now creating proposal items");

      var all_items = [];

      for (const item of items) {
        var temp = {};
        item.proposal_id = proposal.id;
        item.requirements = item.description;
        if (item.image) {
          is_valid_url = await sails.helpers.isValidUrl(item.image);
          if (is_valid_url === false) {
            item.image = await sails.helpers.aws.uploadFile(
              item.image,
              "proposal-items"
            );
          }
        }

        if (item.remarks_image) {
          is_valid_url = await sails.helpers.isValidUrl(item.remarks_image);
          if (is_valid_url === false) {
            item.remarks_image = await sails.helpers.aws.uploadFile(
              item.remarks_image,
              "proposal-items"
            );
          }
        }
      }

      if (items) {
        await Proposal_item.createEach(items);
      }

      data = await sails.helpers.getProposalInvoice.with({
        proposal_id: proposal.id,
        language: inputs.vendor.language,
      });

      return exits.success({
        status: true,
        message: sails.config.strings.en.PROPOSAL_CREATED,
        data: data,
      });
    }
  },
};
