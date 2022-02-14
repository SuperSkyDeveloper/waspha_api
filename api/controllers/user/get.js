module.exports = {

  friendlyName: 'Get',


  description: 'Get user.',


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


  fn: async function (inputs) {

    // All done.   
    var user = await User.findOne({ id: inputs.id });
    if (!user) { throw 'notFound'; }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      contact:user.contact
    };

  }


};
