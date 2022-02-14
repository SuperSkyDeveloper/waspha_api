module.exports = {


  friendlyName: 'Generate random',


  description: '',


  inputs: {

  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs, exits) {
    sails.log("calling helpers/generate-random")
   let max = 9999;
   let min = 1000;
   let random = Math.floor(
    Math.random() * (max - min) + min
    );
    
    return exits.success(random)
  }


};

