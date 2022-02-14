module.exports = {
  friendlyName: "Change online status",

  description: "",

  inputs: {
    admin: {
      type: "ref",
      required: true,
      description: "logged in admin",
    },
    id: {
      type: "number",
      required: true,
    },
    is_online: {
      type: "boolean",
      required: true,
    },
    role: {
      type: "string",
      required: true,
      isIn: [global.ROLE.VENDOR, global.ROLE.DRIVER],
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
    sails.log("calling action driver/change-online-status");

    try {
      let rec = { is_online: inputs.is_online };
      let model = inputs.role;
      if (inputs.role == global.ROLE.VENDOR) {
        model = "store";
      }

      var updated = await sails.models[model]
        .updateOne({ id: inputs.id })
        .set(rec);
      sails.log({ rec: rec, updated: updated });
      if (updated) {
        if (updated.vendor_id) {
          let vendor = await Vendor.findOne({
            where: { id: updated.vendor_id },
            select: ["device_token"],
          });
          let title = "Online status update";
          let body = "Your online status has been updated by admin";
          let extra_data = JSON.stringify({
            is_online: updated.is_online,
          });

          await sails.helpers.sendPushNotification(
            vendor.id,
            global.ROLE.VENDOR,
            title,
            body,
            true,
            extra_data,
            sails.config.notification.type.ONLINE_STATUS_UPDATED
          );
        }
        return exits.success({
          status: true,
          message: sails.config.strings[inputs.admin.language].STATUS_CHANGED,
          data: { is_online: inputs.is_online },
        });
      }
      return exits.ok({
        status: false,
        message:
          sails.config.strings[inputs.admin.language].UNABLE_TO_CHANGE_STATUS,
        data: [],
      });
    } catch (err) {
      sails.log.error(
        `Error changing online status for role ${inpute.role}, id ${inputs.id}. ${err}`
      );
      return exits.ok({
        status: false,
        message:
          sails.config.strings[inputs.admin.language].UNABLE_TO_CHANGE_STATUS,
        data: [],
      });
    }
  },
};
