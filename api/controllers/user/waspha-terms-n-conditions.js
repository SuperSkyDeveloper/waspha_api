const strings = global.strings
module.exports = {


  friendlyName: 'Waspha terms n conditions',


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
    sails.log("calling action user/waspha-terms-n-conditions");
    try{
      let terms = await sails.helpers.getWasphaSettings('terms_and_conditions_user');
      if(!terms.length){
        return exits.ok({
          status: false,
          message: strings['en'].NOT_FOUND,
          data: []
        })
      }
      terms[0].key = 'terms_and_conditions';
      return exits.success({
        status: true,
        message: strings['en'].FOUND,
        data: terms[0]
      })

    }catch(err){
      sails.log.error(`Error in getting waspha terms & conditions: ${err}`)
      return exits.ok({
        status: false,
        message: strings['en'].NOT_FOUND,
        data: []
      })
    }
  }


};
