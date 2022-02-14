module.exports = {
  friendlyName: "Send message to vendor",

  description: "",

  inputs: {
    admin: {
      type: "ref",
      required: true,
      description: "logged in admin",
    },
    vendor_id: {
      type: "number",
      required: true,
    },
    message: {
      type: "string",
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
    sails.log("calling action admin/send-message-to-vendor");
    try {
      let vendor = await Vendor.findOne({ id: inputs.vendor_id });
      if (!vendor) {
        return exits.ok({
          status: false,
          message: "Invalid vendor id",
          data: [],
        });
      }
      let rec = {
        vendor_id: inputs.vendor_id,
        message: inputs.message,
      };
      // sails.helpers.mail.send(
      //   vendor.email,
      //   inputs.subject || "Message From Waspha Admin",
      //   `<p>${inputs.message}</p>`
      // );
      let previous = await Vendor_message.find({
        vendor_id: inputs.vendor_id,
        deletedAt: null,
      }).limit(1);
      let updated = null;
      if (previous[0]) {
        updated = await Vendor_message.updateOne({ id: previous[0].id }).set(
          rec
        );
      } else {
        updated = await Vendor_message.create(rec).fetch();
      }

      let template = await sails.helpers.getNotificationTemplate(
        sails.config.notification.type.MESSAGE_FROM_ADMIN
      );

      let title = template.meta[vendor.language];

      let body = template[vendor.language];
      let extra_data = JSON.stringify({
        message_id: updated.id || null,
        sent_by: { name: "waspha", avatar: inputs.admin.avatar },
      });
      await sails.helpers.sendPushNotification(
        vendor.id,
        global.ROLE.VENDOR,
        title,
        body,
        false,
        extra_data,
        sails.config.notification.type.MESSAGE_FROM_ADMIN
      );
      await sails.helpers.general.addNotification(
        vendor.id,
        global.ROLE.VENDOR,
        title,
        body,
        extra_data,
        sails.config.notification.type.MESSAGE_FROM_ADMIN
      );
      return exits.success({
        status: true,
        message: "Sent successfully",
        data: [],
      });
    } catch (err) {
      sails.log.error(`Error in action super-admin/send-message. ${err}`);
      return exits.ok({
        status: false,
        message: "Unable to sent",
        data: [],
      });
    }
  },
};
