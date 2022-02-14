module.exports = {


  friendlyName: 'Update user',


  description: '',


  inputs: {
    id: {
      type: 'number',
      required: true
    },
    name: {
      type: 'string',
      required: false
    }
  },


  exits: {

  },


  fn: async function (inputs, exits) {
    sails.log('calling action admin/update-user');
    const user = await User.updateOne({id: inputs.id}).set({name: inputs.name});
   return exits.success({
     status: true,
     message: 'User updated successfully',
     data: user
   })

  }


};
