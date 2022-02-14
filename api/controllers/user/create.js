const bcrypt = require('bcryptjs');
module.exports = {


  friendlyName: 'Create',


  description: 'Create user.',


  inputs: {
    name: {
      type: 'string',
      required: true
      },
    email: {
      type: 'string',
      required: true
      },
    contact: {
      type: 'string',
      required: true
      },
    password: {
      type: 'string',
      required: true
      }
  },


  exits: {
    found: {
      description: 'User with specified email already exists.',      
    },
    serverError:{
      description:"send server error",
      responseType:"serverError"
  }
  },


  fn: async function (inputs, exits) {

    $user = await User.find({email: inputs.email});  
    console.log($user.length)  
    if($user.length > 0){
      return 'email already exists';
    }
    
    const name = inputs.name;
    const email = inputs.email;
    const password = inputs.password;
    const contact = inputs.contact;
    

    bcrypt
    .hash(password, 12)
    .then(async(hashedPassword) => {
        

        try {
          var user = await User.create({
            name:name,
            email:email,
            password: hashedPassword,
            contact: contact            
         }).fetch();
         sails.log(`User created with email '${inputs.email}'`)  
         delete user.password
         return exits.success({
          status: true,
          data: user,
          message: 'user created successfully'
        });
          
        } catch (err) {
          return exits.serverError(err)
        }
    })    
    .catch(err => {
      return exits.serverError(err)     
    })
    

  }


};
