module.exports = {
  friendlyName: "Get All Notification Templates",

  description: "",

  inputs: {},

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helpers/get-all-notification-templates");

    const statuses = await Notification_template.find();
    const all_templates = {};
    if (statuses.length) {
      statuses.forEach((status) => {
        all_templates[status.notification_type] = status.id;
      });
    }
    return exits.success(all_templates);
  },
};
