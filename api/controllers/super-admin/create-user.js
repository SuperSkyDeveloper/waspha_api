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
      type: 'json',
      required: true,
      custom: function(value){        
        return _.isObject(value) 
        &&  !_.isUndefined(value.country_code) 
       // && !_.isUndefined(value.phone_number)
        && !_.isUndefined( value.number)       
      }
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
    sails.log('calling action admin/create-user')
    $user = await User.findOne({email: inputs.email});  
    
    if($user){
      return exits.found({
        status: true,
        message: 'User with this email already exists',
        data: []
      })
    }
    $user = await User.findOne({contact: inputs.contact.number.replace(/\s/g, ''),country_code: inputs.contact.country_code});  
    
    if($user){
      return exits.found({
        status: true,
        message: 'User with this contact number already exists',
        data: []
      })
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
            country_code: contact.country_code,
            contact: contact.number.replace(/\s/g, '')            
         }).fetch();
         sails.log(`User created with email '${inputs.email}'`)  
         delete user.password
         return exits.success({
          status: true,
          data: user,
          message: 'User created successfully'
        });
          
        } catch (err) {
          sails.log.error(`Error creating user. ${err}`);
          return exits.serverError({
            status: false,
            message: 'Unable to create user',
            data: []
          })
        }
    })    
    .catch(err => {
      sails.log.error(`Error creating user. ${err}`);
      return exits.serverError({
        status: false,
        message: 'Unable to create user',
        data: []
      })     
    })
    

  }


};
