const { exists } = require("grunt");

module.exports = {


  friendlyName: 'Mark notification as read',


  description: '',


  inputs: {
      id:  {
          type: 'number',
          required: true
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
    sails.log("calling helpers/genera/mark-as-read");
  
    const id = inputs.id;   
    const role = inputs.role;
    let updated = false;
    try{
      switch(role){
        case 'admin':{
         // await Admin.updateOne({id: id}).set({device_token: device_token});
          updated = true;
          break;
        }
        case 'vendor':{
           await Vendor_notification.updateOne({id: id}).set({is_read: true});
          updated = true;
          break;
        }
        case 'driver':{
          await Driver_notification.updateOne({id: id}).set({is_read: true});
          updated = true;
          break;
        }
        case 'user':{
          await User_notification.updateOne({id: id}).set({is_read: true});
          updated = true;
          break;
        }
      }
      return exits.success(updated);

    }catch(err){
      sails.log.error(`Error in helper general/mark-as-read`);
      return exits.success(updated)
    }
 
  }


};

