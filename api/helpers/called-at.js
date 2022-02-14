const moment = require('moment');
module.exports = {


  friendlyName: 'Called at',


  description: '',


  inputs: {

  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs, exits) {
    let called_at = moment().toISOString();
    return exits.success(called_at);
  }


};

