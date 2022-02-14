module.exports = {
  friendlyName: "Mark notification as read",

  description: "",

  inputs: {
    vendor: {
      type: "ref",
      required: true,
      description: "logged in vendor",
    },

    type: {
      type: "string",
      required: false,
      defaultsTo: "notification",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    let updated = await sails.helpers.general.markAsViewed(
      inputs.vendor.id,
      inputs.type,
      global.ROLE.VENDOR
    );
    // updated = true;
    var unviewed_counts = {};
    unviewed_counts.notifications = await sails.helpers.general.countUnviewedNotifications(
      inputs.vendor.id,
      global.ROLE.VENDOR
    );
    // unviewed_counts.orders = await sails.helpers.general.countUnreadRfps(
    //   inputs.vendor.store.id,
    //   global.ROLE.VENDOR,
    //   [global.STATUS.PENDING]
    // );
    // unviewed_counts.latest_orders = await sails.helpers.general.countUnreadProposals(
    //   inputs.vendor.store.id,
    //   global.ROLE.VENDOR,
    //   [
    //     global.STATUS.COMPLETED,
    //     global.STATUS.ASSIGNED_ONLINE,
    //     global.STATUS.ASSIGNED_OFFLINE,
    //     global.STATUS.CANCELLED,
    //   ]
    // );
    // unviewed_counts.dashboard = unviewed_counts.notifications;
    // unviewed_counts.accepted_orders = await sails.helpers.general.countUnreadProposals(
    //   inputs.vendor.store.id,
    //   global.ROLE.VENDOR,
    //   [global.STATUS.ACCEPTED]
    // );
    // unviewed_counts.waspha_box = 8;

    return exits.success({
      status: updated,
      data: unviewed_counts,
    });
  },
};
