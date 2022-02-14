const strings = global.strings
module.exports = {


  friendlyName: 'Waspha Copyright policy',


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
    sails.log("calling action user/waspha-copyright-policy");
    try{
      let terms = await sails.helpers.getWasphaSettings('copyright_policy_user');
      if(!terms.length){
        return exits.ok({
          status: false,
          message: strings['en'].NOT_FOUND,
          data: []
        })
      }
      terms[0].key = 'copyright_policy';
      return exits.success({
        status: true,
        message: strings['en'].FOUND,
        data: terms[0]
      })

    }catch(err){
      sails.log.error(`Error in getting waspha copyright policy: ${err}`)
      return exits.ok({
        status: false,
        message: strings['en'].NOT_FOUND,
        data: []
      })
    }
  }


};
