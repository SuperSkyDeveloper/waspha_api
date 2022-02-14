/**
 * isDriverApproved
 *
 * @module :: Policy
 * @description :: Checks that driver is logged in and adds driver to input
 * @docs :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */

module.exports = async (req, res, next) => {
  const driver = req.param("driver");
  sails.log.debug(
    `policy isDriverApproved driver_id: ${driver.id} path: ${req.path}`
  );

  if (driver.status == true) {
    return next();
  }
  sails.log.warn(`Admin approval is required for driver_id ${driver.id}`);
  return res.ok({
    status: false,
    message: sails.config.strings[driver.language].ADMIN_APPROVAL_REQUIRED,
    data: [],
  });
};
