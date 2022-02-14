/**
 * Promo_code_restricted_vendor.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "promo_code_restricted_vendors",
  primaryKey: "id",
  attributes: {
    createdAt: false,
    updatedAt: false,
    promo_code_id: {
      model: "promo_code",
    },
    vendor_id: {
      model: "store",
    },
  },
};
