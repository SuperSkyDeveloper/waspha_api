/**
 * isLoggedIn
 *
 * @module :: Policy
 * @description :: Checks that vendor is logged in and adds vendor to input
 * @docs :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */

module.exports = async (req, res, next) => {
  // vendor is allowed, proceed to the next policy,
  // or if this is the last policy, the controller
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.forbidden();

  let vendor;

  try {
    vendor = await sails.helpers.jwt.verifyToken.with({ token });
  } catch (e) {
    sails.log.error(e);
    return res.forbidden();
  }

  const vendors = await Vendor.find({ id: vendor.id })
    .populate("store", {
      select: [
        "id",
        "business_name",
        "ar",
        "image",
        "address",
        "lat",
        "lng",
        "is_online",
        "proposal_prep_time",
        "proposal_selection_time",
        "waspha_fee_pickup",
        "waspha_fee_pickup_type",
        "waspha_fee_delivery",
        "waspha_fee_delivery_type",
        "credit_amount",
        "debit_amount",
      ],
    })
    .limit(1);

  if (vendors[0]) {
    if (vendors[0].store[0]) {
      let store = vendors[0].store[0];
      delete vendors.store;
      vendors[0]["store"] = store;
    }

    sails.log.debug(
      `policy isVendorLoggedIn vendor_id: ${vendors[0].id} path: ${req.path}`
    );
    req.body.vendor = vendors[0];
    return next();
  }

  return res.unauthorized();
};
