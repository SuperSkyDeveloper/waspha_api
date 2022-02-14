const { exists } = require("grunt");
const Category = require("../models/Category");

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
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs, exits) {
    sails.log("calling helpers/category-exist")
    let exists = false;
    let categories = null;
    if(inputs.slug)
    {
       categories = await sails.model.category.find({slug: inputs.slug}).limit(1);      
    }
    else
    {
      categories = await sails.models.category.find({id: inputs.id}).limit(1);
    }
    
    if(categories[0])
    {
      exists = true;
    }
    return exits.success(exists);
  }


};

