/**
 * isAdminLoggedIn
 *
 * @module :: Policy
 * @description :: Checks that admin is logged in and adds admin to input
 * @docs :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */

module.exports = async (req, res, next) => {
  // admin is allowed, proceed to the next policy,
  // or if this is the last policy, the controller
  sails.log("calling policy isAdminLoggedIn");
  const authHeader = req.headers["authorization"];
  sails.log(`authHeader: ${authHeader}`);

  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.forbidden();

  let admin;

  try {
    admin = await sails.helpers.jwt.verifyToken.with({ token });
  } catch (e) {
    sails.log.error(e);
    return res.forbidden();
  }

  const admins = await Admin.find({ email: admin.email, id: admin.id })
    .populate("role_id")
    .limit(1);

  if (admins[0]) {
    admins[0].role = admins[0].role_id;
    delete admins[0].role_id;
    admins[0].country = await sails.helpers.general.getCountry(
      admins[0].id,
      global.ROLE.ADMIN
    );
    sails.log.debug(
      `policy isAdminLoggedIn admin_id: ${admins[0].id} path: ${req.path}`
    );
    if (req.method == "GET") {
      req.params.admin = JSON.stringify(admins[0]);
    } else {
      req.body.admin = admins[0];
    }
    //console.log("query:",req.param('admin'));

    return next();
  }

  return res.unauthorized();
};
