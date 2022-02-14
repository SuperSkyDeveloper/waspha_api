module.exports = {


  friendlyName: 'Add location',


  description: '',


  inputs: {
    user: {
      type: 'ref',
      required: true,
      description: 'logged in user'
    },  
    title: {
      type: 'string',
      required: true
    },  
    phone: {
      type: 'string',
      required: true,
      minLength:11
    },  
    landmark: {
      type: 'string',
      required: true
    },  
    location: {
      type: 'json',     
      required:true ,
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
    sails.log('calling action user/add-location');
    const rec = {
      user_id: inputs.user.id,
      title: inputs.title,
      phone: inputs.phone,
      landmark: inputs.landmark,
      address: inputs.location.address,
      lat: inputs.location.lat,
      lng: inputs.location.lng,
    };
    try{
      const location = await User_address.create(rec).fetch();
      if(location){
        return exits.success({
          status: true,
          message: sails.config.strings[inputs.user.language].CREATED,
          data: location
        })
      }
      return exits.ok({
        status: false,
        message: sails.config.strings[inputs.user.language].UNABLE_TO_CREATE,
        data: []
      })

    }catch(err){
      sails.log.error(`Error adding location for user id ${inputs.user.id}. Error: ${err}`);
      return exits.ok({
        status: false,
        message: sails.config.strings[inputs.user.language].UNABLE_TO_CREATE,
        data: []
      })
    }

  }


};
