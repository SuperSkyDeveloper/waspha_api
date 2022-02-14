module.exports = {
  friendlyName: "Change vendor status",

  description: "",

  inputs: {
    admin: {
      type: "ref",
      required: true,
      description: "logged in admin",
    },

    is_approved: {
      type: "boolean",
      required: true,
    },
    vendor_id: {
      type: "number",
      required: false,
    },
    store_id: {
      type: "number",
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
    created: {
      description: "Send created response",
      responseType: "created",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action admin/change-vendor-status");

    sails.log({ inputs: inputs });
    let template = await sails.helpers.getNotificationTemplate(
      sails.config.notification.type.ACCOUNT_APPROVED
    );
    let vendor_id = null;
    if (inputs.store_id) {
      let store = await Store.findOne({
        where: { id: inputs.store_id },
        select: ["vendor_id"],
      });
      vendor_id = store.vendor_id;
    } else {
      vendor_id = inputs.vendor_id;
    }
    let country = await sails.helpers.general.getCountry(
      vendor_id,
      global.ROLE.VENDOR
    );
    let commission = await Waspha_commission.find({
      country: country.id,
    }).limit(1);
    if (!commission.length) {
      return exits.ok({
        status: false,
        message:
          "Could not approve vendor. Please add user commission for vendor's country",
        data: [],
      });
    }

    let is_approved = inputs.is_approved;

    vendor = await Vendor.findOne({ id: vendor_id });
    let message = "invalid vendor id";
    if (!vendor) {
      return exits.ok({
        status: false,
        message: message,
        data: [],
      });
    }

    vendor = await Vendor.updateOne({ id: vendor_id }).set({
      status: is_approved,
    });
    // sails.log({updated: vendor})
    let accepted_or_rejected = is_approved == true ? "approved" : "rejected";
    message =
      "Vendor " +
      (is_approved == true ? "approved" : "rejected") +
      " successfully";
    let title = template.meta[vendor.language];

    let body = template[vendor.language].replace(
      "{status}",
      accepted_or_rejected
    );
    let extra_data = JSON.stringify({
      sent_by: { name: "waspha", avatar: inputs.admin.avatar },
      id: vendor.id || null,
      status: accepted_or_rejected,
    });

    await sails.helpers.sendPushNotification(
      vendor.id,
      global.ROLE.VENDOR,
      title,
      body,
      false,
      extra_data,
      sails.config.notification.type.ACCOUNT_APPROVED
    );

    await sails.helpers.general.addNotification(
      vendor.id,
      global.ROLE.VENDOR,
      title,
      body,
      extra_data,
      sails.config.notification.type.ACCOUNT_APPROVED
    );
    return exits.created({
      status: true,
      message: message,
      data: [],
    });
  },
};
