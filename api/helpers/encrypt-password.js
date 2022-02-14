const bcrypt = require('bcryptjs');
module.exports = {


    friendlyName: 'Generate random',
  
  
    description: '',
  
  
    inputs: {
        password: {
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
      sails.log("calling helpers/encrypt-password")

       // bcrypt
    // .hash(inputs.password, 12)
    // .then((hashedPassword) => {
    //     sails.log(`Password encrypted`)
    //                        console.log("hashedPassword:",hashedPassword)                    
    //      rec['password'] = hashedPassword;              
    // })    
    // .catch(err => {
    //   return exits.serverError({
    //     status: false,
    //     message: `Unable to update driver. Error ${err}`,
    //     data: []
    //   })
    // })
    /////
    // var pass =bcrypt.hash(inputs.password, 12,async function passwordEncrypted(err, hashedPassword) {
    //     new Promise(reject, () => {

    //     })  
    //   if (err) {
    //     return exits.serverError({
    //       status: false,
    //       message: `Unable to update driver. Error ${err}`,
    //       data: []
    //     })
    //   }
    //   sails.log(`Password encrypted`)
    //   return  hashedPassword;
      
    //    }); 
      const password = await bcrypt.hash(inputs.password, 12);
      
      return exits.success(password);
    }
  
  
  };
  
  