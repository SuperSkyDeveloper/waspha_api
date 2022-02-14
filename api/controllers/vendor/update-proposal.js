const notification = global.notification;

module.exports = {
  friendlyName: "Update proposal",

  description: "",

  inputs: {
    vendor: {
      type: "ref",
      required: true,
      description: "logged in vendor",
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
    sails.log("calling action vendor/update-proposal");

    const statuses = await sails.helpers.getAllStatuses();
    let query = `
      SELECT p.id,p.is_revised, rfp.user_id
      FROM proposals p    
      INNER JOIN request_for_proposal_store rfp_store
        ON rfp_store.id = p.rfp_store_id
      INNER JOIN request_for_proposals rfp
        ON rfp.id = rfp_store.rfp_id
      INNER JOIN stores s
        ON s.id = rfp_store.store_id
      WHERE s.vendor_id = ${inputs.vendor.id}
      AND p.id = ${inputs.proposal_id}
      AND p.status_id IN(${statuses.pending})
    
    `;
    let result = await sails.sendNativeQuery(query);
    // const attachedp = await sails.models.request_for_proposal_store.findOne({
    //   'and':[
    //   {proposal_id: inputs.proposal_id},
    //   {store_id: inputs.vendor.store.id}
    //   ]
    // });
    if (!result.rows.length) {
      sails.log.warn(
        "Invalid proposal id or proposal does not belong to current vendor's store"
      );
      return exits.ok({
        status: false,
        message:
          sails.config.strings[inputs.vendor.language].INVALID_PROPOSAL_ID,
        data: [],
      });
    }
    let user_id = result.rows[0].user_id;

    const proposal_id = inputs.proposal_id;

    const items = inputs.items;

    // const rec = {
    //   is_revised: false,
    // };

    // //rec.status_id = statuses.pending;
    // sails.log("updating proposal");

    // var proposal = await Proposal.updateOne({ id: inputs.proposal_id }).set(
    //   rec
    // );

    //if (proposal.id)
    {
      sails.log("Proposal updated, now updating proposal items");

      var all_items = [];
      let item_ids = _.map(items, "id");
      sails.log({ item_ids: item_ids });
      await Proposal_item.destroy({
        id: { "!=": item_ids },
        proposal_id: inputs.proposal_id,
      });
      let items_to_create = [];
      let is_valid_url = false;
      for (const item of items) {
        var temp = {};
        item.proposal_id = inputs.proposal_id;

        if (item.title && !_.isUndefined(item.title.en)) {
          item.title = item.title.en;
        }
        if (item.description && !_.isUndefined(item.description.en)) {
          item.description = item.description.en;
        }
        if (item.image && !_.isUndefined(item.image.en)) {
          is_valid_url = await sails.helpers.isValidUrl(item.image);
          if (is_valid_url === false) {
            item.image = await sails.helpers.aws.uploadFile(
              item.image.en,
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
        if (!_.isUndefined(item.id)) {
          let old_rec = await Proposal_item.findOne({
            where: { id: item.id },
            select: ["image", "remarks_image"],
          });
          if (old_rec.image) {
            await sails.helpers.aws.deleteFile(old_rec.image);
          }
          if (old_rec.remarks_image) {
            await sails.helpers.aws.deleteFile(old_rec.remarks_image);
          }
          await Proposal_item.updateOne({ id: item.id }).set(item);
        } else {
          items_to_create.push(item);
        }
      }

      if (items_to_create.length) {
        await Proposal_item.createEach(items_to_create);
      }

      data = await sails.helpers.getProposalInvoice.with({
        proposal_id: inputs.proposal_id,
        language: inputs.vendor.language,
      });
      return exits.success({
        status: true,
        message: sails.config.strings[inputs.vendor.language].PROPOSAL_UPDATED,
        data: data,
      });
    }

    //////////
  },
};
