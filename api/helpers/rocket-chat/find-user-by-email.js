module.exports = {


  friendlyName: 'Find user by email',


  description: '',


  inputs: {
    email: {
      type: 'string',
      required: true
    },
    admin: {
      type: 'json',
      required: false
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs, exits) {
    sails.log('calling helper rocket-chat/find-user-by-email');
    let data = {};    
    let admin = null;
    if(_.isUndefined(inputs.admin)){
      admin = await sails.helpers.rocketChat.login(process.env.ROCKET_CHAT_EMAIL, process.env.ROCKET_CHAT_PASSWORD);
    }else{
      admin = inputs.admin;
    }
    
    if(!_.isUndefined(admin.rc_auth_token)){
     
      header = {                                              
        "x-auth-token": admin.rc_auth_token,
        "x-user-id":  admin.rc_id              
      };
      let url = process.env.ROCKET_CHAT_URL + `/users.list?query={ "emails": {"$elemMatch": {"address": {"$eq":"${inputs.email}"}}} }`;
      let res = await sails.helpers.request.invoke(url,'GET',{}, header); 
      
      if(!_.isUndefined(res.body.success) && res.body.success === true && res.body.count > 0){
        data['rc_id'] = res.body.users[0]._id;            
        data['rc_username'] = res.body.users[0].username;     
      }
    }
    return exits.success(data);
  }

};

