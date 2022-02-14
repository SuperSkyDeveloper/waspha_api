
module.exports = {


  friendlyName: 'Assign permissions',


  description: '',


  inputs: {
    admin: {
      type: 'ref',
      required: true,
      description: 'logged in admin'
    },
    permissions: {
      type: 'json',
      required: true
    }
  },


  exits: {
    ok: {
      description: 'Send ok response.',      
    },
    found: {
      description: 'Role with specified name already exists.',      
    },
    serverError:{
      description:"send server error",
      responseType:"serverError"
    }

  },


  fn: async function (inputs, exits) {
    sails.log('calling action super-admin/assign-permissions');
    try{
      var role_ids = inputs.permissions.map(value => value.role_id);
      await Permission_role.destroy({role_id: {in: role_ids}});
            
      for(obj of inputs.permissions){
          for(p of obj.permissions){
            await Permission_role.create({role_id: obj.role_id, permission_id: p})
          }
      }
      return exits.success({
        status: true,
        message: sails.config.strings[inputs.admin.language].PERMISSIONS_ASSIGNED,
        data: []
      })
    }catch(err){
      sails.log(`Error assigning permissions. ${err}`);
      return exits.ok({
        status: false,
        message: sails.config.strings[inputs.admin.language].UNABLE_TO_ASSIGN_PERMISSIONS,
        data: []
      })
    }
  }


};
