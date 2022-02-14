/**
 * isLoggedIn
 *
 * @module :: Policy
 * @description :: Checks that vendor is logged in and adds vendor to input
 * @docs :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */

module.exports = async (req, res, next) => {
  const vendor = req.param("vendor");
  sails.log.debug(
    `policy isBusinessRegistered vendor_id: ${vendor.id} path: ${req.path}`
  );

  if (!_.isUndefined(vendor.store.id)) {
    return next();
  }
  sails.log.warn(
    `Business registration is required for vendor_id ${vendor.id}`
  );
  return res.ok({
    status: false,
    message:
      sails.config.strings[vendor.language].BUSINESS_REGISTRATION_REQUIRED,
    data: [],
  });
};
