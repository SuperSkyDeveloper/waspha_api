module.exports = {


    friendlyName: 'Generate random',
  
  
    description: '',
  
  
    inputs: {
        string:{
            type: 'string',
            required: true
        },
        substring:{
            type: 'string',
            required: true
        },
        occurence:{
            type: 'number',
            defaultsTo: 1
        },
    },
  
  
    exits: {
  
      success: {
        description: 'All done.',
      },
  
    },
  
  
    fn: async function (inputs, exits) {
      sails.log("calling helpers/get-character-position")
      let position = inputs.string.split(inputs.substring, inputs.occurence).join(inputs.substring).length;
      return exits.success(position)
    }
  
  
  };
  
  