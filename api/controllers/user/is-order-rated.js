module.exports = {


  friendlyName: 'Is order rated',


  description: '',


  inputs: {
    user: {
      type: 'ref',
      required: true,
      description: 'logged in user'
    },
    order_id: {
      type: 'number',
      required: true
    }
  },


  exits: {

  },


  fn: async function (inputs, exits) {
    sails.log('calling action user/is-order-rated');
    let is_rated = await sails.helpers.general.isOrderRated(inputs.user.id, inputs.order_id, global.ROLE.USER);
    return exits.success({
      status: true,
      data: {is_rated: is_rated}
    })

  }


};
