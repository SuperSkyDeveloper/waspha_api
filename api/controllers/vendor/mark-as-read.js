

module.exports = {


  friendlyName: 'Mark notification as read',


  description: '',


  inputs: {
    vendor: {
      type: 'ref',
      required: true,
      description: 'logged in vendor'
    },    
    id: {
      type: 'number',
      required: true
    },
    type: {
      type: 'string',
      required: false
    }
  },


  exits: {

  },


  fn: async function (inputs, exits) {

    let updated = await sails.helpers.general.markAsRead(inputs.id, global.ROLE.VENDOR);
    var unread_counts = {};
    unread_counts.notifications = await sails.helpers.general.countUnreadNotifications(inputs.vendor.id, global.ROLE.VENDOR);;
    unread_counts.orders = await sails.helpers.general.countUnreadRfps(inputs.vendor.store.id, global.ROLE.VENDOR, [global.STATUS.PENDING]);
    unread_counts.latest_orders = await sails.helpers.general.countUnreadProposals(inputs.vendor.store.id, global.ROLE.VENDOR, [global.STATUS.COMPLETED,global.STATUS.ASSIGNED_ONLINE,global.STATUS.ASSIGNED_OFFLINE,global.STATUS.CANCELLED]);
    unread_counts.dashboard = unread_counts.notifications;
    unread_counts.accepted_orders = await sails.helpers.general.countUnreadProposals(inputs.vendor.store.id, global.ROLE.VENDOR, [global.STATUS.ACCEPTED]);
    unread_counts.waspha_box = 8;
    
    return exits.success({
      status: updated,
      data: unread_counts
    });

  }


};
