

module.exports = {


  friendlyName: 'Get store average rating',


  description: '',


  inputs: {
    store_id: {
      type: 'number',
      required: true
    }
  },


  exits: {

    success: {
      outputFriendlyName: 'Store average rating',
    },

  },


  fn: async function (inputs, exits) {
    sails.log('calling helper get-store-avg-rating');
    try{
      sails.log(`trying to fetch review & ratings, store id: ${inputs.store_id}`);
    
      var rating_average = await Store_review_rating.avg('rating')
      .where({
        store_id: inputs.store_id
      });   
      
      return exits.success(parseFloat(rating_average.toFixed(2)));                                
  
    }
    catch(err){
      sails.log.error(`Error in fetching average rating: ${err}`);
      return exits.success(false);     
    }
  }


};

