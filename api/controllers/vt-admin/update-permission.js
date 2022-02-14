module.exports = {


  friendlyName: 'Update',


  description: 'Update permission.',


  inputs: {
    admin: {
      type: 'ref',
      required: true,
      description: 'logged in admin'
    },
    id: {
      type: 'number',
      required: true
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
      description: 'Permission with specified id does not exist.',      
    },
    notFound: {
      description: 'Permission with specified name already exists.',      
    },
    ok:{
      description:"Send ok response",
      responseType:"ok"
  },
    serverError:{
      description:"send server error",
      responseType:"serverError"
  }
  },


  fn: async function (inputs, exits) {
    sails.log('calling action super-admin/update-permission')
    const id = inputs.id;
    const name = inputs.name.toLowerCase();
    const display_name = inputs.display_name;

    var permission = await Permission.findOne({id: id});  
    
    if(!permission){
      return exits.notFound({
        status: false,
        message: sails.config.strings[inputs.admin.language].INVALID_ID,
        data: []
      })
    }
     permission = await Permission.findOne({id:{'!=': id},name: name});  
    
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
      var permission = await Permission.updateOne({id: id}).set(rec);
     sails.log(`Permission updated with id '${id}'`)  
     
     return exits.success({
      status: true,
      data: permission,
      message: sails.config.strings[inputs.admin.language].UPDATED,      
    });
      
    } catch (err) {
      sails.log.error(`Error creating permission. ${err}`);
      return exits.serverError({
        status: false,
        message: sails.config.strings[inputs.admin.language].UNABLE_TO_UPDATE,        
        data: []
      })
    }
  
    

  }


};
