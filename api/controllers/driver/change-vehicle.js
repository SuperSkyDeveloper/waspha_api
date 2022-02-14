module.exports = {


  friendlyName: 'Change vehicle',


  description: '',


  inputs: {
    driver: {
      type: 'ref',
      required: true,
      description: 'logged in driver'
    },
    vehicle_id: {
      type: 'number',
      required: true
    },
    vehicle_name: {
      type: 'string',
      required: true
    },
    number_plate: {
      type: 'string',
      required: true
    },
  },


  exits: {
    serverError:{
      description:"send server error",
      responseType:"serverError"
    },
    ok:{
        description:"Send ok response",
        responseType:"ok"
    }
  },


  fn: async function (inputs, exits) {

    sails.log('calling action driver/change-vehicle');
    try{
      const vehicle = await Delivery_vehicle.findOne({id: inputs.vehicle_id});
      if(!vehicle){
        return exits.ok({
          status: false,
          message: sails.config.strings[inputs.driver.language].INVALID_VEHICLE_ID,
          data: []
        })
      }

      var rec = {
        vehicle_id: inputs.vehicle_id,
        vehicle_name: inputs.vehicle_name,
        number_plate: inputs.number_plate
      }
      var updated = await Driver.updateOne({id: inputs.driver.id}).set(rec);
      return exits.success({
        status: true,
        message: sails.config.strings[inputs.driver.language].VEHICLE_CHANGED,
        data: updated
      })
    }catch(err){
      sail.log(`Error in changing vehicle for driver id ${inputs.driver.id}. ${err}`);
      return exits.ok({
        status: false,
        message: sails.config.strings[inputs.driver.language].UNABLE_TO_CHANGE_VEHICLE,
        data: []
      })
    }

  }


};
