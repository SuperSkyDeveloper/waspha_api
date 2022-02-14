module.exports = {
  friendlyName: "Send message to user",

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
    role: {
      type: "string",
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
    sails.log("calling action admin/send-message");
    try {
      let role = inputs.role;
      let id = inputs.id;
      let user = await sails.models[role].findOne({ id: id });

      if (!user) {
        return exits.ok({
          status: false,
          message: "Invalid id",
          data: [],
        });
      }
      let rec = {
        message: inputs.message,
      };
      rec[`${role}_id`] = id;
      // sails.helpers.mail.send(
      //   user.email,
      //   inputs.subject || "Message From Waspha Admin",
      //   `<p>${inputs.message}</p>`
      // );
      let where = { deletedAt: null };
      where[`${role}_id`] = id;
      let previous = await sails.models[`${role}_message`].find(where).limit(1);
      let updated = null;
      if (previous[0]) {
        updated = await sails.models[`${role}_message`]
          .updateOne({ id: previous[0].id })
          .set(rec);
      } else {
        updated = await sails.models[`${role}_message`].create(rec).fetch();
      }

      let template = await sails.helpers.getNotificationTemplate(
        sails.config.notification.type.MESSAGE_FROM_ADMIN
      );

      let title = template.meta[user.language];

      let body = template[user.language];
      let extra_data = JSON.stringify({
        message_id: updated.id || null,
        sent_by: { name: "waspha", avatar: inputs.admin.avatar },
      });
      await sails.helpers.sendPushNotification(
        user.id,
        role,
        title,
        body,
        false,
        extra_data,
        sails.config.notification.type.MESSAGE_FROM_ADMIN
      );
      await sails.helpers.general.addNotification(
        user.id,
        role,
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
      sails.log.error(
        `Error in action super-admin/send-message-to-user. ${err}`
      );
      return exits.ok({
        status: false,
        message: "Unable to sent",
        data: [],
      });
    }
  },
};
