module.exports = {


  friendlyName: 'Get wallet',


  description: '',


  inputs: {
    user: {
      type: 'ref',
      required: true,
      description: 'logged in user'
    },
  
  },


  exits: {

  },


  fn: async function (inputs, exits) {
    sails.log('calling action user/get-wallet');
    
    return exits.success({
      status: true,
      data: {wallet: inputs.user.wallet}
    })

  }


};
