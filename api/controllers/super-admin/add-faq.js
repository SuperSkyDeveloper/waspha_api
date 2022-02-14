

module.exports = {


  friendlyName: 'Add faq',


  description: '',


  inputs: {
    title: {
      type: 'string',
      required: true
    },
    description: {
      type: 'string',
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

    sails.log("calling action admin/add-faq");
    const rec = {
      title: inputs.title,
      description: inputs.description
    }

    const faq = await sails.models.faq.create(rec).fetch();
    if(faq)
    {
      return exits.success({
        status: true,
        message: `FAQ created successfully`,
        data: faq
      }); 
    }

    return exits.ok({
      status: true,
      message: `Unable to create FAQ`,
      data: []
    }); 
  }


};
