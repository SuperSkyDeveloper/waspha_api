
module.exports = {


    friendlyName: 'Change password',
  
  
    description: '',
  
  
    inputs: {
        id:  {
            type: 'number',
            required: true
        },
        password:  {
            type: 'string',
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
      sails.log("calling helpers/change-password")
    
      const id = inputs.id;
      const password = inputs.password;
      const role = inputs.role;
      const hashedPassword = await sails.helpers.encryptPassword(password);
      let updated = false;

      switch(role){
        case 'admin':{
          await Admin.updateOne({id: id}).set({password: hashedPassword});
          updated = true;
          break;
        }
        case 'vendor':{
           console.log("role:",hashedPassword)
           updated = await Vendor.updateOne({id: id}).set({password: hashedPassword});
          updated = true;
          break;
        }
        case 'driver':{
          await Driver.updateOne({id: id}).set({password: hashedPassword});
          updated = true;
          break;
        }
        case 'user':{
          await User.updateOne({id: id}).set({password: hashedPassword});
          updated = true;
          break;
        }
      }
      return exits.success(updated);
    }
  
  
  };
  
  