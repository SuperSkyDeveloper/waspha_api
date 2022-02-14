/**
* isDriverLoggedIn
*
* @module :: Policy
* @description :: Checks that driver is logged in and adds driver to input
* @docs :: http://sailsjs.org/#!/documentation/concepts/Policies
*
*/

module.exports = async (req, res, next) => {
    // driver is allowed, proceed to the next policy,
    // or if this is the last policy, the controller
    sails.log('calling policy isDriverLoggedIn');
    const authHeader = req.headers['authorization'];
    sails.log(`authHeader: ${authHeader}`);
    
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.forbidden();
    
    let driver;
    
    try {
    driver = await sails.helpers.jwt.verifyToken.with({ token });  
    } catch (e) {
    sails.log.error(e);
    return res.forbidden();
    }
    
    const drivers = await Driver.find({email: driver.email,id:driver.id})                                
                                .limit(1);    
    
    if (drivers[0]) {
    sails.log.debug(
    `policy isDriverLoggedIn driver_id: ${drivers[0].id} path: ${req.path}`
    );
    if(req.method == 'GET'){
        req.params.driver = JSON.stringify(drivers[0])
    }else{
        req.body.driver = drivers[0];
    }  
    //console.log("query:",req.param('driver'));
  
    return next();
    }
    
    return res.unauthorized();
    };