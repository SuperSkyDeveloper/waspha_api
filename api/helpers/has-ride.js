module.exports = {


  friendlyName: 'Has ride',


  description: '',


  inputs: {
    driver_id: {
      type: 'number',
      required: true
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs, exits) {
    sails.log('calling helper has-ride');
    const statuses = await sails.helpers.getAllStatuses();
    var ride = await Proposal_driver.find({driver_id: inputs.driver_id, status_id: [statuses.pending,statuses.accepted, statuses.at_pickup,statuses.picked_up,statuses.delivery_started,statuses.at_delivery,statuses.delivery_confirmed]}).limit(1);
    
    if(ride[0]){
      return exits.success(ride[0])
    }else{
      return exits.success(false)
    }
  }


};

