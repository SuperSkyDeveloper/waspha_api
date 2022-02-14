module.exports = {


  friendlyName: 'Entity exists',


  description: '',


  inputs: {
    id: {
      type: 'number',
      required: true
    },
    model: {
      type: 'string',
      required: true
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs, exits) {
    sails.log('calling helper general/entity-exists');
    try{
      let result = sails.models[inputs.model].find({id: inputs.id}).limit(1);
      if(result[0]){
        return exits.success(result[0]);
      }
      return exits.success(null);
    }catch(err){
      sails.log.error(`Error in helper general/entity-exists. ${err}`);
      return exits.success(null);
    }
  }


};

