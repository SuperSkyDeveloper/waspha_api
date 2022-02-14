module.exports = {


  friendlyName: 'Create',


  description: 'Create permission.',


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
    table: {
      type: 'string',
      required: false
    },   
  },


  exits: {
    found: {
      description: 'Permission with specified name already exists.',      
    },
    serverError:{
      description:"send server error",
      responseType:"serverError"
  }
  },


  fn: async function (inputs, exits) {
    sails.log('calling action super-admin/create-permission')
    const name = inputs.name.toLowerCase();
    const display_name = inputs.display_name;
    var permission = await Permission.findOne({name: name});  
    
    if(permission){
      return exits.found({
        status: true,
        message: sails.config.strings[inputs.admin.language].PERMISSION_ALREADY_EXISTS,
        data: []
      })
    }
    try {
      var rec = {
        name:name,
        display_name: display_name,           
       };
       if(inputs.table){
         rec.table = inputs.table
       }
      var permission = await Permission.create(rec).fetch();
     sails.log(`Permission created with name '${name}'`)  
     
     return exits.success({
      status: true,
      data: permission,
      message: sails.config.strings[inputs.admin.language].CREATED,      
    });
      
    } catch (err) {
      sails.log.error(`Error creating permission. ${err}`);
      return exits.serverError({
        status: false,
        message: sails.config.strings[inputs.admin.language].UNABLE_TO_CREATE,        
        data: []
      })
    }
  
    

  }


};
