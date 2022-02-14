module.exports = {


  friendlyName: 'Locations',


  description: 'Locations user.',


  inputs: {
    user: {
      type: 'ref',
      required: true,
      description: 'logged in user'
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
    sails.log('calling action user/locations');
    try{
      const locations = await User_address.find({
        where: {user_id: inputs.user.id},
        select: ['id','title','phone','address','landmark','lat','lng']
      });
      if(locations.length){
        sails.log(`${locations.length} locations found for user id ${inputs.user.id}`);
        return exits.success({
          status: true,
          message: sails.config.strings[inputs.user.language].LOCATIONS_FOUND.replace('{total}', locations.length),
          data: locations
        })
      }
      sails.log(`No locations found for user id ${inputs.user.id}`);
      return exits.ok({
        status: false,
        message: sails.config.strings[inputs.user.language].LOCATIONS_NOT_FOUND,
        data: []
      });
    }catch(err){
      sails.log.err(`Error getting user locations for user id ${inputs.user.id}. Error: ${err}`);
      return exits.ok({
        status: false,
        message: sails.config.strings[inputs.user.language].UNABLE_TO_FIND_LOCATIONS,
        data: []
      });
    }    

  }


};
