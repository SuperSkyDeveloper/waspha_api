module.exports = {


  friendlyName: 'Trending products',


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
    },
    forbidden:{
      description:"Send forbidden response",
      responseType:"forbidden"
    }
  },


  fn: async function (inputs, exits) {
    sails.log("calling action vendor/trending-products");
    
    var products = await sails.helpers.getTrendingProducts(inputs.vendor.store.id);
   console.log(inputs.vendor.store);
    if(products.length){
      var data = {};
      data.store = {
        name: inputs.vendor.store.business_name,
        rating: await sails.helpers.getStoreAvgRating(inputs.vendor.store.id),
        is_online: inputs.vendor.store.is_online,
        distance: 5
      };
      data.products = products;
      return exits.success({
        status: true,
        message: sails.config.strings[inputs.vendor.language].PRODUCTS_FOUND.replace('{total}', products.length),
        data: data
      });
    }
    return exits.ok({
      status: true,
      message:sails.config.strings[inputs.vendor.language].PRODUCTS_NOT_FOUND,
      data: []
    });
    
  }


};
