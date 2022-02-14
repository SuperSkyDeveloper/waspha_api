module.exports = {


  friendlyName: 'Get sent by',


  description: '',


  inputs: {
    id:{
      type: 'number',
      required: true
    },
    name:{
      type: 'string',
      required: true
    },
    avatar:{
      type: 'string',
      required: false,
      allowNull: true
    },
  },


  exits: {

    success: {
      outputFriendlyName: 'Sent by',
    },

  },


  fn: async function (inputs, exits) {

    return exits.success({
      id: inputs.id,
      name: inputs.name,
      avatar: inputs.avatar
    })

  }


};

