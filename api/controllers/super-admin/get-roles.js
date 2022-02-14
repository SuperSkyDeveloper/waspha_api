module.exports = {


  friendlyName: 'Role',


  description: 'Get all Roles.',


  inputs: {
   
  },


  exits: {
    unauthorized: {
      responseType: 'unauthorized',
      description: 'Send 401 if authentication failed'
    }
  },


  fn: async function (inputs, exits) {
    sails.log('calling action admin/get-roles');
  
  let req = this.req;
  let range = [0,9];
  if(req.query.range){
    range = JSON.parse(req.query.range);
  } 
   
  
  
    console.log("req.query:", req.query);   
    const roles = await Role.find({
      where: {deletedAt: null},
      select: ['id','name', 'display_name']
    })
    .skip(range[0])
    .limit(range[1]+1);
    if(roles.length){
      return exits.success({
        status: true,
        message: sails.config.strings['en'].TOTAL_ROLES_FOUND.replace('{total}', roles.length),
         data:roles
       });
    }
    return exits.ok({
      status: true,
      message: sails.config.strings['en'].ROLES_NOT_FOUND,
       data:[]
     });
  

  }


};
