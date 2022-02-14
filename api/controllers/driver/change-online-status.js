module.exports = {


  friendlyName: 'Change online status',


  description: '',


  inputs: {
    driver: {
      type: 'ref',
      required: true,
      description: 'logged in driver'
    },
    is_online: {
      type: 'boolean',
      required: true,
    },
    location: {
      type: 'json',     
      required:false ,
      custom: function(value){
        return _.isObject(value) 
        //&& typeof value.address !== 'undefined' 
        && typeof value.lat !== 'undefined' 
        && typeof value.lng !== 'undefined'
       // && _.isString(value.address) 
        && _.isNumber(value.lat) 
        && _.isNumber(value.lng); 
      }     
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
    sails.log('calling action driver/change-online-status');
    try{
      let rec = {is_online: inputs.is_online};
      if(inputs.location){
        rec.lat = inputs.location.lat;
        rec.lng = inputs.location.lng;
      }
      
      var updated = await Driver.updateOne({id: inputs.driver.id}).set(rec);
      sails.log({rec:rec,updated: updated})
      if(updated){
        return exits.success({
          status: true,
          message: sails.config.strings[inputs.driver.language].STATUS_CHANGED,
          data: { is_online: inputs.is_online }
        })
      }
      return exits.ok({
        status: false,
        message: sails.config.strings[inputs.driver.language].UNABLE_TO_CHANGE_STATUS,
        data: []
      })
    }catch(err){
      sails.log.error(`Error changing online status for driver id ${inputs.driver.id}. ${err}`);
      return exits.ok({
        status: false,
        message: sails.config.strings[inputs.driver.language].UNABLE_TO_CHANGE_STATUS,
        data: []
      })
    }

  }


};
