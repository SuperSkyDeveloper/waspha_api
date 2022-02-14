module.exports = {
  friendlyName: "Get notification template",

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
  },

  exits: {},

  fn: async function (inputs, exits) {
    sails.log("calling action super-admin/get-notification-template");
    try {
      t = await Notification_template.findOne({
        id: inputs.id,
      }).populate("meta");

      let data = { id: t.id, notification_type: t.notification_type };

      data.title = {
        en: t.meta[0].en,
        ar: t.meta[0].ar,
      };
      data.body = {
        en: t.en,
        ar: t.ar,
      };

      return exits.success({
        status: true,
        message: "",
        data: data,
      });
    } catch (err) {
      sails.log.error(
        `Error in action super-admin/get-notification-template. ${err}`
      );
      return exits.ok({
        status: false,
        message: "",
        data: [],
      });
    }
  },
};
