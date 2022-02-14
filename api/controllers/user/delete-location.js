
module.exports = {


  friendlyName: 'Delete deleted',


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
    sails.log('calling action user/delete-location');
   
    try{
      const exists = await User_address.findOne({id: inputs.id, user_id: inputs.user.id});
      if(!exists){
        return exits.ok({
          status: false,
          message: sails.config.strings[inputs.user.language].INVALID_ID,
          data: []
        })
      }
      
      
      const deleted = await User_address.destroyOne({id: inputs.id});
      
      if(deleted){
        return exits.success({
          status: true,
          message: sails.config.strings[inputs.user.language].DELETED,
          data: []
        })
      }
      
      
      return exits.ok({
        status: true,
        message: sails.config.strings[inputs.user.language].UNABLE_TO_DELETE,
        data: []
      })

    }catch(err){
      sails.log.error(`Error deleting location for user id ${inputs.user.id}. Error: ${err}`);
      return exits.ok({
        status: false,
        message: sails.config.strings[inputs.user.language].UNABLE_TO_DELETE,
        data: []
      })
    }

  }


};
