

module.exports = {


  friendlyName: 'Get permissions',


  description: '',


  inputs: {

  },


  exits: {
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

    sails.log('calling action super-admin/get-permissions');
    try{
      var roles = await Role.find({
          select: ['id','name','display_name']
      });
      var permissions = await Permission.find({
          select: ['id','name','display_name']
      });
      for(role of roles){
        role.permissions = [];
        var perms = null;
        perms = await Permission_role.find({role_id: role.id});
        if(perms.length){
          var perm_ids = perms.map(value => value.permission_id);
          role.permissions = perm_ids;
        }

      }

      var result = {roles: roles, perms: permissions};
    //   for(p of permissions){
    //     if(_.isUndefined(result[p.table])){
    //       result[p.table] = [];
    //     }
    //     result[p.table].push({id: p.id, name: p.name, display_name: p.display_name});
    //   }
      if(result){       
        return exits.success({
          status: true,
          message: sails.config.strings['en'].PERMISSIONS_FOUND,
          data: result
        })
      }   
      return exits.ok({
        status: true,
        message: sails.config.strings['en'].PERMISSIONS_NOT_FOUND,
        data: []
      })      
    }catch(err){
        sails.log(`Error getting permissions list. ${err}`);
        return exits.ok({
          status: true,
          message: sails.config.strings['en'].PERMISSIONS_NOT_FOUND,
          data: []
        })
    }

  }


};
