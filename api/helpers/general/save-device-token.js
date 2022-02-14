
module.exports = {


  friendlyName: 'Change device_token',


  description: '',


  inputs: {
      id:  {
          type: 'number',
          required: true
      },
      device_token:  {
          type: 'string',
          required: true,          
      },
      role:  {
          type: 'string',
          required: true,
          isIn: ['admin','vendor','driver','user']
      },
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs, exits) {
    sails.log("calling helpers/change-device-token")
  
    const id = inputs.id;
    const device_token = inputs.device_token;
    const role = inputs.role;
    let updated = false;

    switch(role){
      case 'admin':{
        await Admin.updateOne({id: id}).set({device_token: device_token});
        updated = true;
        break;
      }
      case 'vendor':{
         updated = await Vendor.updateOne({id: id}).set({device_token: device_token});
        updated = true;
        break;
      }
      case 'driver':{
        await Driver.updateOne({id: id}).set({device_token: device_token});
        updated = true;
        break;
      }
      case 'user':{
        await User.updateOne({id: id}).set({device_token: device_token});
        updated = true;
        break;
      }
    }
    return exits.success(updated);
  }


};

