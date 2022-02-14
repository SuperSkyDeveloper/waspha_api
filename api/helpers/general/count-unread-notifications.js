module.exports = {


  friendlyName: 'Count unread notifications',


  description: '',


  inputs: {
    id: {
      type: 'number',
      required: true
    },
    role: {
      type: 'string',
      required: true
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs, exits) {
    let count = 0;
   
    try{
      switch(inputs.role){
        case global.ROLE.VENDOR: {
          count = await Vendor_notification.count({vendor_id:inputs.id,is_read: 0});
          break;
        }
        case global.ROLE.USER: {
          count = await User_notification.count({user_id:inputs.id,is_read: 0});
          break;
        }
        case global.ROLE.DRIVER: {
          count = await Driver_notification.count({driver_id:inputs.id,is_read: 0});
          break;
        }
      }
    

    }catch(err){
      sails.log.error(`Error in helper count-unread-notifications. ${err}`)
      return exits.success(count);
    }
   
    return exits.success(count);
  }


};

