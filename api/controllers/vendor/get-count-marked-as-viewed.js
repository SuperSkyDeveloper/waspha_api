module.exports = {
  friendlyName: "Get count marked as viewed",

  description: "",

  inputs: {
    vendor: {
      type: "ref",
      required: true,
      description: "logged in vendor",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    var unviewed_counts = {};
    unviewed_counts.notifications = await sails.helpers.general.countUnviewedNotifications(
      inputs.vendor.id,
      global.ROLE.VENDOR
    );
    return exits.success({
      status: true,
      data: unviewed_counts,
      message: "",
    });
  },
};
