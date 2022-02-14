module.exports = {


  friendlyName: 'Delete',


  description: 'Delete user.',


  inputs: {
    id: {
      type: 'number',
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

    var user = await User.findOne({ id: inputs.id });
    if (!user) { throw 'notFound'; }

    var updatedUser = await User.destroyOne({ id:inputs.id });
    var success = {status:true, message:'User deleted successfully'}
    return exits.success(success);
  }


};
