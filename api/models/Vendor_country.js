/**
 * Vendor_country.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "vendor_country",
  primaryKey: "id",

  attributes: {
    vendor_id: {
      model: "vendor",
    },
    country_id: {
      model: "country",
    },
  },
};
