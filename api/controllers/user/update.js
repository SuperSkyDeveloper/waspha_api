module.exports = {


  friendlyName: 'Update',


  description: 'Update user.',


  inputs: {
    id: {
      type: 'number',
      required: true
      },
    name: {
      type: 'string',
      required: true
      }
  },


  exits: {
    notFound: {
      description: 'No user with the specified ID was found in the database.',
      responseType: 'notFound'
    }
  },


  fn: async function (inputs, exits) {
sails.log("calling user/update")
    var user = await User.findOne({ id: inputs.id });
    if (!user) { throw 'notFound'; }

    var updatedUser = await User.updateOne({ id:inputs.id })
      .set({
        name:inputs.name
      });

    var success = {status:true, message:'User updated successfully',data:updatedUser}
    return exits.success(success);

  }


};
