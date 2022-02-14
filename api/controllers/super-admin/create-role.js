module.exports = {


  friendlyName: 'Create',


  description: 'Create role.',


  inputs: {
    admin: {
      type: 'ref',
      required: true,
      description: 'logged in admin'
    },
    name: {
      type: 'string',
      required: true
    },
    display_name: {
      type: 'string',
      required: true
    },   
  },


  exits: {
    found: {
      description: 'Role with specified name already exists.',      
    },
    serverError:{
      description:"send server error",
      responseType:"serverError"
  }
  },


  fn: async function (inputs, exits) {
    sails.log('calling action admin/create-role')
    const name = inputs.name.toLowerCase();
    const display_name = inputs.display_name;
    var role = await Role.findOne({name: name});  
    
    if(role){
      return exits.found({
        status: true,
        message: sails.config.strings[inputs.admin.language].ROLE_ALREADY_EXISTS,
        data: []
      })
    }
    try {
      var role = await Role.create({
        name:name,
        display_name: display_name,           
       }).fetch();
     sails.log(`Role created with name '${name}'`)  
     
     return exits.success({
      status: true,
      data: role,
      message: sails.config.strings[inputs.admin.language].CREATED,      
    });
      
    } catch (err) {
      sails.log.error(`Error creating role. ${err}`);
      return exits.serverError({
        status: false,
        message: sails.config.strings[inputs.admin.language].UNABLE_TO_CREATE,        
        data: []
      })
    }
  
    

  }


};
