/**
 * isVendorApproved
 *
 * @module :: Policy
 * @description :: Checks that vendor is logged in and adds vendor to input
 * @docs :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */

module.exports = async (req, res, next) => {
  const vendor = req.param("vendor");
  sails.log.debug(
    `policy isVendorApproved vendor_id: ${vendor.id} path: ${req.path}`
  );

  if (vendor.status == true) {
    return next();
  }
  sails.log.warn(`Admin approval is required for vendor_id ${vendor.id}`);
  return res.ok({
    status: false,
    message: sails.config.strings[vendor.language].ADMIN_APPROVAL_REQUIRED,
    data: [],
  });
};
