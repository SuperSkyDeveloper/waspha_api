const strings = sails.config.strings;

module.exports = {
  friendlyName: "Confirm bill",

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
    is_revised: {
      type: "boolean",
      required: false,
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
    sails.log("calling action vendor/confirm-bill");

    const templates = await sails.helpers.getAllNotificationTemplates();
    let template = await sails.helpers.getNotificationTemplate(
      sails.config.notification.type.PROPOSAL_RECEIVED
    );
    const statuses = await sails.helpers.getAllStatuses();
    const updatedProposal = await Proposal.updateOne({
      id: inputs.proposal_id,
    }).set({ status_id: statuses.pending });

    if (updatedProposal) {
      let user = await sails.helpers.getUserOfOrder(
        updatedProposal.id,
        "proposal"
      );

      const attachedRfp = await sails.models.request_for_proposal_store
        .updateOne({ id: updatedProposal.rfp_store_id })
        .set({ status_id: statuses.accepted });

      if (attachedRfp.is_specific == true) {
        await sails.helpers.updateRfpStatus(
          statuses.current,
          updatedProposal.id
        );
      }

      if (!_.isUndefined(inputs.is_revised) && inputs.is_revised == true) {
        const rec = {
          is_revised: false,
        };

        //rec.status_id = statuses.pending;
        sails.log("proposal has been updated by vendor");

        await Proposal.updateOne({ id: updatedProposal.id }).set(rec);
        updatedProposal.is_revised = false;

        let user = await sails.helpers.getUserOfOrder(
          updatedProposal.id,
          "proposal"
        );
        business_name = await sails.helpers.convertHtmlIntoText(
          inputs.vendor.store.business_name
        );

        let title = template.meta[user.language];
        let body = template[user.language]
          .replace("{vendor}", business_name)
          .replace("{order_id}", attachedRfp.rfp_id);
        // let title = "Proposal updated";
        // let body = "A proposal has been updated";
        let extra_data = JSON.stringify({
          proposal_id: inputs.proposal_id || null,
          rfp_id: attachedRfp.rfp_id,
          sent_by: {
            name: business_name,
            avatar: inputs.vendor.store.image,
          },
        });

        await sails.helpers.sendPushNotification(
          user.id,
          global.ROLE.USER,
          title,
          body,
          false,
          extra_data,
          sails.config.notification.type.PROPOSAL_RECEIVED
        );
        await sails.helpers.general.addNotification(
          user.id,
          global.ROLE.USER,
          null,
          null,
          extra_data,
          sails.config.notification.type.PROPOSAL_RECEIVED,
          templates[sails.config.notification.type.PROPOSAL_RECEIVED]
        );
      } else {
        let order_status = {
          proposal_id: updatedProposal.id,
          order_placed: attachedRfp.createdAt,
          proposal_sent: updatedProposal.createdAt,
        };
        await Order_status.updateOrCreate(
          { proposal_id: order_status.proposal_id },
          order_status
        );
        let user = await sails.helpers.getUserOfOrder(
          updatedProposal.id,
          "proposal"
        );

        business_name = await sails.helpers.convertHtmlIntoText(
          inputs.vendor.store.business_name
        );

        let title = template.meta[user.language];
        let body = template[user.language]
          .replace("{vendor}", business_name)
          .replace("{order_id}", attachedRfp.rfp_id);
        let extra_data = JSON.stringify({
          proposal_id: updatedProposal.id || null,
          rfp_id: attachedRfp.rfp_id,
          sent_by: {
            name: business_name,
            avatar: inputs.vendor.store.image,
          },
        });

        await sails.helpers.sendPushNotification(
          user.id,
          global.ROLE.USER,
          title,
          body,
          false,
          extra_data,
          sails.config.notification.type.PROPOSAL_RECEIVED
        );
        await sails.helpers.general.addNotification(
          user.id,
          global.ROLE.USER,
          null,
          null,
          extra_data,
          sails.config.notification.type.PROPOSAL_RECEIVED,
          templates[sails.config.notification.type.PROPOSAL_RECEIVED]
        );
      }

      // await sails.models.request_for_proposal.updateOne({id: attachedRfp.rfp_id}).set({status_id: statuses.accepted})
      return exits.success({
        status: true,
        message: strings[inputs.vendor.language].CONFIRMED,
        data: [updatedProposal],
      });
    }
    return exits.ok({
      status: false,
      message: strings[inputs.vendor.language].UNABLE_TO_CONFIRM,
      data: [],
    });
  },
};
