module.exports = {


  friendlyName: 'Add subcategory',


  description: '',


  inputs: {

    category_id: {
      type: 'number',
      required: true
      },
    name: {
      type: 'string',
      required: true
      },
    slug: {
      type: 'string',
      required: true       
      },
    image: {
      type: 'string',
      required: false      
      },
    description: {
      type: 'string',
      required: false      
      },
  },


  exits: {

  },


  fn: async function (inputs, exits) {
    sails.log("calling action admin/add-subcategory");
  
    let subcategories = await Subcategory.find({slug: inputs.slug}).limit(1);
    let categories = await Category.find({id: inputs.category_id}).limit(1);
    const category_id = inputs.category_id;
    const name = inputs.name;
    const slug = inputs.slug;
    const image = inputs.image;
    if(!categories[0])
    {
      return exits.success({
        status: false,
        data: [],
        message: 'Invalid category id'
      });
    }
    if(subcategories[0])
    {
      return exits.success({
        status: false,
        data: subcategories[0],
        message: 'subcategory with this slug already exists'
      });
    }
    else
    {
      const rec = {
        category_id: category_id,
        name: name,
        slug: slug,        
      };
      if(inputs.image)
      {
        rec['image'] = inputs.image;
      }
      if(inputs.description)
      {
        rec['description'] = inputs.description;
      }
      try {
          var subcategory =  await Subcategory.create(rec).fetch();
        console.log("record:",rec);
        if(subcategory.id)
        {
            sails.log(`subcategory created with id '${subcategory.id}'`)        
                
          return exits.success({
            status: true,
            data: subcategory,
            message: 'subcategory created successfully'
          });
        }
      }catch (err) {
        sails.log.error(`Error in creating subcategory: ${err}`)
        return exits.serverError({status: false, message: `Error in creating subcategory: ${err}`})
      // …
      }
    }
  }


};
