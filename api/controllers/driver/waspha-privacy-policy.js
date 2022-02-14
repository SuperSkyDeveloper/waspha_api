const strings = global.strings
module.exports = {


  friendlyName: 'Waspha privacy policy',


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
    sails.log("calling action driver/waspha-privacy-policy");
    try{
      let policy = await sails.helpers.getWasphaSettings('privacy_policy_driver');
      if(!policy.length){
        return exits.ok({
          status: false,
          message: strings['en'].NOT_FOUND,
          data: []
        })
      }
      policy[0].key = 'privacy_policy';
      return exits.success({
        status: true,
        message: strings['en'].FOUND,
        data: policy[0]
      })

    }catch(err){
      sails.log.error(`Error in getting waspha privacy policy: ${err}`)
      return exits.ok({
        status: false,
        message: strings['en'].NOT_FOUND,
        data: []
      })
    }
  }


};
