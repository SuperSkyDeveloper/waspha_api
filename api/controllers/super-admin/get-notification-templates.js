const { exists, template } = require("grunt");

module.exports = {
  friendlyName: "Get notification templates",

  description: "",

  inputs: {
    admin: {
      type: "ref",
      required: true,
      description: "logged in admin",
    },
  },

  exits: {
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action super-admin/get-notification-templates");
    try {
      let all_templates = [];
      templates = await Notification_template.find().populate("meta");
      for (t of templates) {
        let template = { id: t.id, notification_type: t.notification_type };

        template.title = {
          en: t.meta[0].en,
          ar: t.meta[0].ar,
        };
        template.body = {
          en: t.en,
          ar: t.ar,
        };
        all_templates.push(template);
      }
      all_templates[0].total = all_templates.length;
      return exits.success({
        status: true,
        message: "",
        data: all_templates,
      });
    } catch (err) {
      sails.log.error(
        `Error in action super-admin/get-notification-templates. ${err}`
      );
      return exits.ok({
        status: false,
        message: "",
        data: [],
      });
    }
  },
};
