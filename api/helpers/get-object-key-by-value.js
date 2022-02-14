module.exports = {


  friendlyName: 'Get objec key by value',


  description: '',


  inputs: {
    object: {
      type: 'ref',
      required: true
    },
    value:{
      type: 'json',
      required: true
    }
  },


  exits: {

    success: {
      outputFriendlyName: 'Objec key by value',
    },

  },


  fn: async function (inputs, exits) {
    let object = {...inputs.object}
    let value = inputs.value;
    return exits.success(Object.keys(object).find(key => object[key] === value));    
  }


};

