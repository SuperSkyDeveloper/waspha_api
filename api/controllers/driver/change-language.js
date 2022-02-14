module.exports = {


  friendlyName: 'Change language',


  description: 'Change language driver',


  inputs: {
    driver: {
      type: 'ref',
      required: true,
      description: 'logged in driver'
    },
    language: {
      type: 'string',
      required: true,
      isIn: ['en','ar','EN','AR']
    }
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

    let passwordChanged = await sails.helpers.general.changeLanguage(inputs.driver.id,inputs.language.toLowerCase(),'driver');
    let driver_language = inputs.driver.language
    if(passwordChanged)
    {
      return exits.success({
        status: true,
        message: sails.config.strings[driver_language].LANGUAGE_CHANGED,
        data: []      
      });
    }
    return exits.ok({
      status: true,
      message: sails.config.strings[driver_language].UNABLE_TO_CHANGE_LANGUAGE,
      data: []      
    });

  }


};
