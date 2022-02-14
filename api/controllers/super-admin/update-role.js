module.exports = {


  friendlyName: 'Update role',


  description: '',


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
    }
  },


  exits: {
    found: {
      description: 'Role with specified name already exists.',      
    },
  },


  fn: async function (inputs, exits) {
    sails.log('calling action super-admin/update-role');
    const id = inputs.id;
    const name = inputs.name.toLowerCase();
    const display_name = inputs.display_name;
    var role = await Role.findOne({
      and : [
        { name: name },
        { id: {'!=': id} }
      ]
    });
   
    if(role){
      return exits.found({
        status: true,
        message: sails.config.strings[inputs.admin.language].ROLE_ALREADY_EXISTS,
        data: role
      })
    }
    role = await Role.updateOne({id: id}).set({name: name, display_name: display_name});
   return exits.success({
     status: true,
     message: sails.config.strings[inputs.admin.language].UPDATED,
     data: role
   })

  }


};
