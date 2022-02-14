function createdRecordObj(inputs){
  var rec = {};
  if(inputs.title){
    rec.title = inputs.title;
  }
  if(inputs.phone){
    rec.phone = inputs.phone;
  }
  if(inputs.landmark){
    rec.landmark = inputs.landmark;
  }
  if(inputs.location && inputs.location.address){
    rec.address = inputs.location.address;
  }
  if(inputs.location && inputs.location.lat){
    rec.lat = inputs.location.lat;
  }
  if(inputs.location && inputs.location.lng){
    rec.lng = inputs.location.lng;
  }
  return rec;
}
module.exports = {


  friendlyName: 'Edit location',


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
    },  
    title: {
      type: 'string',
      required: false
    },  
    phone: {
      type: 'string',
      required: false,
      minLength:11
    },  
    landmark: {
      type: 'string',
      required: false
    },  
    location: {
      type: 'json',     
      required:false ,
      custom: function(value){
        return _.isObject(value) 
        && typeof value.address !== 'undefined' 
        && typeof value.lat !== 'undefined' 
        && typeof value.lng !== 'undefined'
        && _.isString(value.address) 
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
    sails.log('calling action user/edit-location');
   
    try{
      const exists = await User_address.findOne({id: inputs.id, user_id: inputs.user.id});
      if(!exists){
        return exits.ok({
          status: false,
          message: sails.config.strings[inputs.user.language].INVALID_ID,
          data: []
        })
      }
      var rec  = createdRecordObj(inputs);
      if(!_.isEmpty(rec)){
        const location = await User_address.updateOne({id: inputs.id}).set(rec);
        if(location){
          return exits.success({
            status: true,
            message: sails.config.strings[inputs.user.language].UPDATED,
            data: location
          })
        }
      }
      
      return exits.ok({
        status: true,
        message: sails.config.strings[inputs.user.language].NOTHING_TO_UPDATE,
        data: []
      })

    }catch(err){
      sails.log.error(`Error updating location for user id ${inputs.user.id}. Error: ${err}`);
      return exits.ok({
        status: false,
        message: sails.config.strings[inputs.user.language].UNABLE_TO_UPDATE,
        data: []
      })
    }

  }


};
