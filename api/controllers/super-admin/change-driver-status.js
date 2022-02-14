module.exports = {
  friendlyName: "Change driver status",

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
    driver_id: {
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
  },

  fn: async function (inputs, exits) {
    sails.log("calling action admin/change-driver-status");
    sails.log({ inputs: inputs });
    let template = await sails.helpers.getNotificationTemplate(
      sails.config.notification.type.ACCOUNT_APPROVED
    );
    let driver_id = inputs.driver_id;

    let is_approved = inputs.is_approved;

    driver = await Driver.findOne({ id: driver_id });
    let message = "invalid driver id";
    if (!driver) {
      return exits.ok({
        status: false,
        message: message,
        data: [],
      });
    }

    let rec = { status: is_approved };
    // if (is_approved == false) {
    //   rec.zone_option = null;
    //   rec.is_zone_selected = false;
    //   rec.free_zone_radius = null;

    //   await Driver_fixed_zone.destroy({ driver_id: driver.id });
    // }
    driver = await Driver.updateOne({ id: driver_id }).set(rec);
    // sails.log({updated: driver})
    let accepted_or_rejected = is_approved == true ? "approved" : "rejected";
    message =
      "driver " +
      (is_approved == true ? "approved" : "rejected") +
      " successfully";
    let title = template.meta[driver.language];

    let body = template[driver.language].replace(
      "{status}",
      accepted_or_rejected
    );
    let extra_data = JSON.stringify({
      sent_by: { name: "waspha", avatar: inputs.admin.avatar },
      id: driver.id || null,
      status: accepted_or_rejected,
    });

    if (inputs.is_approved == false) {
      await sails.helpers.sendPushNotification(
        driver.id,
        global.ROLE.DRIVER,
        title,
        body,
        false,
        extra_data,
        sails.config.notification.type.ACCOUNT_DISAPPROVED
      );

      await sails.helpers.general.addNotification(
        driver.id,
        global.ROLE.DRIVER,
        title,
        body,
        extra_data,
        sails.config.notification.type.ACCOUNT_DISAPPROVED
      );
    }
    return exits.success({
      status: true,
      message: message,
      data: [],
    });
  },
};
