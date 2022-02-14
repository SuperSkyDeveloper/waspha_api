const request = require('request');
module.exports = {


  friendlyName: 'Create token',


  description: 'Create token rocket chat.',


  inputs: {
    email: {
      type: 'string',
      required: true
    },
    name: {
      type: 'string',
      required: true
    },    
    password: {
      type: 'string',
      required: true
    },
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs, exits) {
    sails.log('calling helper rocket-chat/create-token');
    
    let data = {};
    let admin = await sails.helpers.rocketChat.login(process.env.ROCKET_CHAT_EMAIL, process.env.ROCKET_CHAT_PASSWORD);
    if(!_.isUndefined(admin.rc_auth_token)){
      let postfields = {
        "email":inputs.email,
        "name":inputs.name,
        "username":inputs.name.replace(' ','').toLowerCase(),
        "password": inputs.password,
      };    
      header = {                                              
        "x-auth-token": admin.rc_auth_token,
        "x-user-id":  admin.rc_id              
      };
      let url = process.env.ROCKET_CHAT_URL + '/users.createToken';
      let res = await sails.helpers.request.invoke(url,'POST',postfields, header);    
      console.log({res: res});
      if(!_.isUndefined(res.body.success) && res.body.success === true)
      {            
          //data['rc_auth_token'] = res.body.data.authToken;
          data['rc_id'] = res.body.user._id;            
          data['rc_username'] = res.body.user.username;                      
      }
    }
    console.log({data111: data});
    return exits.success(data);
  }


};

