module.exports = {
  friendlyName: "Revise proposal",

  description: "",

  inputs: {
    user: {
      type: "ref",
      required: true,
      description: "logged in user",
    },
    proposal_id: {
      type: "number",
      required: true,
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
    sails.log("calling action user/revise-proposal");

    let item_with_zero_quantity = _.find(inputs.items, { quantity: 0 });
    sails.log({ item_with_zero_quantity: item_with_zero_quantity });
    if (item_with_zero_quantity) {
      return exits.ok({
        status: false,
        message:
          sails.config.strings[inputs.user.language]
            .YOU_CANT_REVISE_WITH_ZERO_QUANTITY,
        data: [],
      });
    }

    var query = `
      SELECT p.id,p.revision_number, s.vendor_id,v.language AS v_language
      FROM proposals p
      INNER JOIN request_for_proposal_store rfp_store
        ON rfp_store.id = p.rfp_store_id
      INNER JOIN stores s
        ON s.id = rfp_store.store_id    
      INNER JOIN vendors v
        ON v.id = s.vendor_id 
      INNER JOIN request_for_proposals rfp
        ON rfp.id = rfp_store.rfp_id
      INNER JOIN users u
        ON u.id = rfp.user_id
      WHERE p.id = ${inputs.proposal_id}
      AND u.id = ${inputs.user.id}
    `;

    try {
      const statuses = await sails.helpers.getAllStatuses();
      var result = await sails.sendNativeQuery(query);
      if (!result.rows.length) {
        return exits.ok({
          status: false,
          message:
            sails.config.strings[inputs.user.language].INVALID_PROPOSAL_ID,
          data: [],
        });
      }
      let revision_number = result.rows[0].revision_number;
      let vendor_id = result.rows[0].vendor_id;
      var item_ids = inputs.items.map((value) => value.id);

      var valid_items = await Proposal_item.find({
        id: item_ids,
        proposal_id: inputs.proposal_id,
      });
      if (!valid_items.length || valid_items.length !== item_ids.length) {
        return exits.ok({
          status: false,
          message:
            sails.config.strings[inputs.user.language].SOME_INVALID_ITEMS,
          data: [],
        });
      }

      for (item of inputs.items) {
        var rec = {
          proposal_item_id: item.id,
          quantity: item.quantity,
          remarks: item.remarks,
        };
        if (item.remarks_image) {
          let is_valid_url = await sails.helpers.isValidUrl(item.remarks_image);

          if (is_valid_url === false) {
            sails.log({ is_valid_url: is_valid_url });
            rec.remarks_image = await sails.helpers.aws.uploadFile(
              item.remarks_image,
              "revised-items"
            );
            sails.log({ remarks_image: item.remarks_image });
          }
        }
        var existing = await Proposal_revised_item.findOne({
          proposal_item_id: item.id,
        });
        if (existing) {
          await Proposal_revised_item.updateOne({ id: existing.id }).set(rec);
        } else {
          await Proposal_revised_item.create(rec);
        }
      }
      await Proposal.updateOne({ id: inputs.proposal_id }).set({
        is_revised: true,
        revision_number: revision_number + 1,
      });

      let template = await sails.helpers.getNotificationTemplate(
        sails.config.notification.type.PROPOSAL_REVISED
      );
      let title = template.meta[result.rows[0].v_language];
      let body = template[result.rows[0].v_language]
        .replace("{proposal_id}", inputs.proposal_id)
        .replace("{user}", inputs.user.name);
      extra_data = JSON.stringify({
        id: inputs.proposal_id || null,
        sent_by: {
          name: inputs.user.name,
          avatar: inputs.user.avatar || null,
        },
      });

      await sails.helpers.sendPushNotification(
        vendor_id,
        global.ROLE.VENDOR,
        title,
        body,
        false,
        extra_data,
        sails.config.notification.type.PROPOSAL_REVISED
      );
      await sails.helpers.general.addNotification(
        vendor_id,
        global.ROLE.VENDOR,
        title,
        body,
        extra_data,
        sails.config.notification.type.PROPOSAL_REVISED
      );
      return exits.success({
        status: true,
        message: sails.config.strings[inputs.user.language].PROPOSAL_REVISED,
        data: [],
      });
    } catch (err) {
      sails.log.error(
        `Error in revising proposal. Proposal id: ${inputs.proposal_id}, user id: ${inputs.user.id}. ${err}`
      );
      return exits.ok({
        status: false,
        message: sails.config.strings[inputs.user.language].UNABLE_TO_PROCESS,
        data: [],
      });
    }
  },
};
