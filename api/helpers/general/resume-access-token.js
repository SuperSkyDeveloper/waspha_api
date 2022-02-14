module.exports = {


  friendlyName: 'Resume access token',


  description: '',


  inputs: {
    refresh_token: {
      type: 'string',
      required: true
    },
    role: {
      type: 'string',
      isIn:['admin','vendor','driver','user'],
      defaultsTo: 'vendor'
    }
    
  },

  exits: {    
  },


  fn: async function (inputs,exits) {
    sails.log("calling helpers/general/resume-access-token");
    let role = inputs.role;
    
    const user = await sails.helpers.jwt.refreshToken(inputs.refresh_token, role);
    
    if(user){
      return exits.success(user);
    }
    
    return exits.success(false);

  }


};
