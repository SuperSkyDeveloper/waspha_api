module.exports = {


    friendlyName: 'Get delivery modes',
  
  
    description: '',
  
  
    inputs: {      
    },
  
    exits: {
  
      success: {
        description: 'All done.',
      },
  
    },
  
  
    fn: async function (inputs, exits) {
      sails.log("calling helpers/get-delivery-modes")

      const delivery_modes = await Delivery_mode.find();
      const  all_delivery_modes = {};
      if(delivery_modes.length)
      {        
        delivery_modes.forEach(mode => {
          all_delivery_modes[mode.name] = mode.id
        });
      }
      return exits.success(all_delivery_modes);
    }
  
  
  };
  
  