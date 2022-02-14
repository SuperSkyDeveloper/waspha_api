const { exists } = require("grunt");

module.exports = {


  friendlyName: 'Mark notification as read',


  description: '',


  inputs: {
    driver: {
      type: 'ref',
      required: true,
      description: 'logged in driver'
    },    
    id: {
      type: 'number',
      required: true
    }
  },


  exits: {

  },


  fn: async function (inputs, exits) {

    let updated = await sails.helpers.general.markAsRead(inputs.id, global.ROLE.DRIVER);

    return exits.success({
      status: updated,
    });

  }


};
