module.exports = {


  friendlyName: 'Get role',


  description: '',


  inputs: {
    id: {
      type: 'number',
      required: true
    }
  },


  exits: {
    ok:{
      description:"Send ok response",
      responseType:"ok"
    }
  },


  fn: async function (inputs, exits) {
    sails.log('calling action super-admin/get-role');
    const role = await Role.findOne({id: inputs.id});
    
    if(role){
      var permissions = await Permission.find();

      var result = {};
      for(p of permissions){
        if(_.isUndefined(result[p.table])){
          result[p.table] = [];
        }
        result[p.table].push({id: p.id, name: p.name, display_name: p.display_name});
      }
      //role.permissions = result;
      return exits.success({
        status: true,
        message: sails.config.strings['en'].ROLE_FOUND,
        data: role
      })
    }
    return exits.ok({
      status: false,
      message: sails.config.strings['en'].INVALID_ROLE_ID,
      data: []
    })
   

  }


};
