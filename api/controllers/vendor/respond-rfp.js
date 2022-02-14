const Request_for_proposal_store = require("../../models/Request_for_proposal_store");

module.exports = {
  friendlyName: "Respond rfp",

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
    accept: {
      type: "boolean",
      required: false,
    },
    reasons: {
      type: "json",
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
    sails.log("calling action vendor/respond-rfp");
    const strings = sails.config.strings[inputs.vendor.language];
    const attachedRfp = await sails.models.request_for_proposal_store.findOne({
      and: [{ rfp_id: inputs.rfp_id }, { store_id: inputs.vendor.store.id }],
    });

    if (!attachedRfp) {
      sails.log.warn(
        "Invalid rfp id or rfp does not belong to current vendor's store"
      );
      return exits.ok({
        status: false,
        message: strings.INVALID_RFP_ID,
        data: [],
      });
    }

    const templates = await sails.helpers.getAllNotificationTemplates();
    const statuses = await sails.helpers.getAllStatuses();
    const accept = typeof inputs.accept === "undefined" ? false : inputs.accept;
    let updated = await sails.models.request_for_proposal_store
      .updateOne({ id: attachedRfp.id })
      .set({ status_id: statuses.rejected }); //status rejected id = 4
    if (accept === false && updated.is_specific === true) {
      let updated_rfp = await Request_for_proposal.updateOne({
        id: updated.rfp_id,
      }).set({ status_id: statuses.rejected });
    }
    if (accept == false) {
      let user = await sails.helpers.getUserOfOrder(inputs.rfp_id, "rfp");

      let template = await sails.helpers.getNotificationTemplate(
        sails.config.notification.type.RFP_REJECTED
      );
      business_name = await sails.helpers.convertHtmlIntoText(
        inputs.vendor.store.business_name
      );
      let title = template.meta[user.language];
      let body = template[user.language]
        .replace("{rfp_id}", inputs.rfp_id)
        .replace("{vendor}", business_name);
      let extra_data = JSON.stringify({
        rfp_id: inputs.rfp_id || null,
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
        sails.config.notification.type.RFP_REJECTED
      );
      await sails.helpers.general.addNotification(
        user.id,
        global.ROLE.USER,
        null,
        null,
        extra_data,
        sails.config.notification.type.RFP_REJECTED,
        templates[sails.config.notification.type.RFP_REJECTED]
      );
    }

    let message =
      "RFP " + (accept == false ? "rejected" : "accepted") + " successfully";
    if (inputs.vendor.language == "ar") {
      message = "تم " + (accept == false ? "رفض" : "قبول") + " RFP بنجاح";
    }
    return exits.success({
      status: true,
      message: message,
      data: [updated],
    });
  },
};
