module.exports = {


  friendlyName: 'Store reviews ratings',


  description: '',


  inputs: {
    vendor: {
      type: 'ref',
      required: true,
      description: 'logged in vendor'
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
    sails.log("calling action vendor/store-reviews-ratings");
    
    data = await sails.helpers.getStoreReviewsRatings(inputs.vendor.store.id);

    if(data !== false){
      return exits.success({
        status: true,
        message: sails.config.strings[inputs.vendor.language].REVIEWS_FOUND.replace('{total}', data.reviews_ratings.length),
        data: data
      });      
    }
    return exits.ok({
      status: true,
      message: sails.config.strings[inputs.vendor.language].REVIEWS_NOT_FOUND,
      data: []
    })     
  
    
  }


};
