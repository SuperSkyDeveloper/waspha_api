module.exports = {


  friendlyName: 'Add notification',


  description: '',


  inputs: {
    id: {
      type: 'number',
      required: true
    },
    role: {
      type: 'string',
      required: true,      
    },
    title: {
      type: 'string',
      required: true
    },
    body: {
      type: 'string',
      required: true
    },
    extra_data: {
      type: 'ref',
      required: true
    },
    template_id: {
      type: 'number',
      required: false
    },

  },


  exits: {
    ok:{
      description:"Send ok response",
      responseType:"ok"
    },
    serverError:{
      description:"send server error",
      responseType:"serverError"
    },
  },


  fn: async function (inputs,exits) {
    
    try{

      let rec = {};
      rec.title = inputs.title;
      rec.body = inputs.body;
      rec.extra_data = JSON.stringify(inputs.extra_data);
      let created = null;
      if(inputs.template_id){
        rec.template_id = inputs.template_id
      }
      switch(inputs.role){
        case global.ROLE.VENDOR: {
          rec.vendor_id = inputs.id
          created = await Vendor_notification.create(rec).fetch();
          break;
        }
        case global.ROLE.USER: {
          rec.user_id = inputs.id
          created = await User_notification.create(rec).fetch();
          break;
        }
        case global.ROLE.DRIVER: {
          rec.driver_id = inputs.id
          created =  await Driver_notification.create(rec).fetch();
          break;
        }
      }
      return exits.success({
        status: true,
        message: 'added',
        data: created

      })
    }catch(err){
      sails.log(`Error in adding notification, ${err}`);
      return exits.ok({
        status: false,
        message: 'failed'
      })
    }

  }


};
