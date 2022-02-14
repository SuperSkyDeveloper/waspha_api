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
    parent_id:{
      type:"number",
      required: true
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
    sails.log("calling helpers/subcategory-exist")
    let exists = false;
    let categories = null;
    if(inputs.slug)
    {
      categories = await sails.models.category.find({
        and: [
            { slug: inputs.slug },
            { parent_id: inputs.parent_id }
        ]
      })      
       .limit(1);      
    }
    else
    {
      categories = await sails.models.category.find({
        and: [
            { id: inputs.id },
            { parent_id: inputs.parent_id }
        ]
      })      
      .limit(1);
      console.log(categories[0],inputs.parent_id);
    }
    
    if(categories[0])
    {
      exists = true;
    }
   
    return exits.success(exists);
  }


};

