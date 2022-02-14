/**
* isLoggedIn
*
* @module :: Policy
* @description :: Checks that user is logged in and adds user to input
* @docs :: http://sailsjs.org/#!/documentation/concepts/Policies
*
*/

module.exports = async (req, res, next) => {
    // User is allowed, proceed to the next policy,
    // or if this is the last policy, the controller
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.forbidden();
    
    let user;
    
    try {
    user = await sails.helpers.jwt.verifyToken.with({ token });
    } catch (e) {
    sails.log.error(e);
    return res.forbidden();
    }
    
    const users = await User.find({ id: user.id }).limit(1);
    
    if (users[0]) {
    sails.log.debug(
    `policy isLoggedIn user_id: ${users[0].id} path: ${req.path}`
    );
    req.body.user = users[0];
    return next();
    }
    
    return res.unauthorized();
    };