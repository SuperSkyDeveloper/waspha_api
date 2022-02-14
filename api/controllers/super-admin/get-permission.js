module.exports = {


  friendlyName: 'Get permission',


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
    sails.log('calling action super-admin/get-permission');
    const permission = await Permission.findOne({id: inputs.id});
    if(permission){
      return exits.success({
        status: true,
        message: sails.config.strings['en'].PERMISSION_FOUND,
        data: permission
      })
    }
    return exits.ok({
      status: false,
      message: sails.config.strings['en'].INVALID_PERMISSION_ID,
      data: []
    })
   

  }


};
