const { exists } = require("grunt");

module.exports = {


  friendlyName: 'Mark notification as read',


  description: '',


  inputs: {
    user: {
      type: 'ref',
      required: true,
      description: 'logged in user'
    },    
    id: {
      type: 'number',
      required: true
    }
  },


  exits: {

  },


  fn: async function (inputs, exits) {

    let updated = await sails.helpers.general.markAsRead(inputs.id, global.ROLE.USER);

    return exits.success({
      status: updated,
    });

  }


};
