const strings = global.strings
module.exports = {


  friendlyName: 'Waspha cookie policy',


  description: '',


  inputs: {
  
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
    sails.log("calling action driver/waspha-cookie-policy");
    try{
      let terms = await sails.helpers.getWasphaSettings('cookie_policy_driver');
      if(!terms.length){
        return exits.ok({
          status: false,
          message: strings['en'].NOT_FOUND,
          data: []
        })
      }
      terms[0].key = 'cookie_policy';
      return exits.success({
        status: true,
        message: strings['en'].FOUND,
        data: terms[0]
      })

    }catch(err){
      sails.log.error(`Error in getting waspha cookie policy: ${err}`)
      return exits.ok({
        status: false,
        message: strings['en'].NOT_FOUND,
        data: []
      })
    }
  }


};
