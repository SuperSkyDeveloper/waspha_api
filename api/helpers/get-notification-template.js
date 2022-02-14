module.exports = {
  friendlyName: "Get notification template",

  description: "",

  inputs: {
    notification_type: {
      type: "string",
      required: true,
    },
    all_templates: {
      type: "json",
      required: false,
    },
  },

  exits: {
    success: {
      outputFriendlyName: "Notification template",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper get-notification-template");
    let data = null;
    let template = null;
    try {
      if (_.isUndefined(inputs.all_templates)) {
        template = await Notification_template.findOne({
          where: { notification_type: inputs.notification_type },
        }).populate("meta");
      } else {
      }

      sails.log({ inputs: inputs, template: template });
      if (template) {
        template.meta = template.meta[0];
        data = template;
      }
      return exits.success(data);
    } catch (err) {
      sails.log.error(`Error in helper get-notification-template. ${err}`);
      return exits.success(data);
    }
  },
};
