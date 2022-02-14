
module.exports = {


  friendlyName: 'Generate random',


  description: '',


  inputs: {
    id:{
      type:"number",
      required: false
    },
    slug:{
      type:"string",
      required: false
    },
    store_id:{
      type:"number",
      required: false
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs, exits) {
    sails.log("calling helpers/business-category-exist")
    let exists = false;
    let categories = null;
    let where = {};
    if(inputs.store_id){
      where.store_id = inputs.store_id;
    }
    if(inputs.slug){
      where.slug = inputs.slug;          
    }else{
      where.id = inputs.id;      
    }
    categories = await sails.models.business_category.find(where).limit(1);
    
    if(categories[0])
    {
      exists = true;
    }
    return exits.success(exists);
  }


};

