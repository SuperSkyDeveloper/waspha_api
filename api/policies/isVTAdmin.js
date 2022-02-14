/**
* isVTAdmin
*
* @module :: Policy
* @description :: Checks that admin is logged in and adds admin to input
* @docs :: http://sailsjs.org/#!/documentation/concepts/Policies
*
*/

module.exports = async (req, res, next) => {

  var admin = null;
    if(req.method == 'GET'){
      admin =  req.param('admin');
    }else{
      admin = req.body.admin;
    }  
  
    
    sails.log.debug(
        `policy isVTAdmin admin_id: ${admin.id} path: ${req.path}`
     );
    const role = await Role.findOne({name: 'vt_admin'});
     
    if(!role || admin.role_id !== role.id)
    {
      sails.log.warn(`Role is not vt_admin for admin_id ${admin.id}`)
      return res.forbidden({
          status: false,
          message: `Unauthorized`,
          data: []
      });        
    }
    return next();
  
};