module.exports = {


  friendlyName: 'Is order rated',


  description: '',


  inputs: {
    vendor: {
      type: 'ref',
      required: true,
      description: 'logged in vendor'
    },
    order_id: {
      type: 'number',
      required: true
    }
  },


  exits: {

  },


  fn: async function (inputs, exits) {
    sails.log('calling action vendor/is-order-rated');
    let is_rated = await sails.helpers.general.isOrderRated(inputs.vendor.store.id, inputs.order_id, global.ROLE.VENDOR);
    return exits.success({
      status: true,
      data: {is_rated: is_rated}
    })

  }


};
