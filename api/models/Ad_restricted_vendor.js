/**
 * Ad_restricted_vendor.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "ad_restricted_vendors",
  primaryKey: "id",

  attributes: {
    createdAt: false,
    updatedAt: false,
    ad_id: {
      model: "ad",
    },
    vendor_id: {
      model: "vendor",
    },
  },
};
