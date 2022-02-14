const moment = require( 'moment' );
module.exports = {


  friendlyName: 'Delete product',


  description: '',


  inputs: {
    vendor: {
      type: 'ref',
      required: true,
      description: 'logged in vendor'
    },
    id: {
      type: 'number',
      required: true
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
    sails.log("calling action vendor/delete-product");
    let stores = await Store.find({vendor_id: inputs.vendor.id}).limit(1);
    if(stores[0])
    {
      let products = await Store_product.find({id: inputs.id, store_id: stores[0].id}).limit(1);
      if(!products[0])
      {
        return exits.ok({
          status: false,
          message: sails.config.strings[inputs.vendor.language].INVALID_PRODUCT_ID,
          data: []          
        });
      }
     
      try {
        var product =  await Store_product.updateOne({ id:inputs.id }).set({deletedAt: moment().format("YYYY-MM-DD HH:mm:ss")});
        if(product.id)
        {
            sails.log(`product deleted with id '${product.id}'`)        
                
          return exits.success({
            status: true,
            message: sails.config.strings[inputs.vendor.language].DELETED,
            data: [],            
          });
        }
      }catch (err) {
        sails.log.error(`Error in deleting product: ${err}`)
         return exits.serverError({
           status: false, 
           message: sails.config.strings[inputs.vendor.language].UNABLE_TO_DELETE,
           data: []
          })
      
      }
    }
    
  }


};
