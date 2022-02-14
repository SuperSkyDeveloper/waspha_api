module.exports = {


  friendlyName: 'Driver reviews ratings',


  description: '',


  inputs: {
    driver: {
      type: 'ref',
      required: true,
      description: 'logged in driver'
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
    sails.log("calling action driver/reviews-ratings");
    
    data = await sails.helpers.getDriverReviewsRatings(inputs.driver.id);

    if(data !== false){
      return exits.success({
        status: true,
        message: sails.config.strings[inputs.driver.language].REVIEWS_FOUND.replace('{total}', data.reviews_ratings.length),
        data: data
      });      
    }
    return exits.ok({
      status: true,
      message: sails.config.strings[inputs.driver.language].REVIEWS_NOT_FOUND,
      data: []
    })     
  
    
  }


};
