module.exports = {


  friendlyName: 'user reviews ratings',


  description: '',


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
    sails.log("calling action user/reviews-ratings");
    
    data = await sails.helpers.getUserReviewsRatings(inputs.user.id);

    if(data !== false){
      return exits.success({
        status: true,
        message: sails.config.strings[inputs.user.language].REVIEWS_FOUND.replace('{total}', data.reviews_ratings.length),
        data: data
      });      
    }
    return exits.ok({
      status: true,
      message: sails.config.strings[inputs.user.language].REVIEWS_NOT_FOUND,
      data: []
    })     
  
    
  }


};
