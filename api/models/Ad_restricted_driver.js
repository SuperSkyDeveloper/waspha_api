/**
 * Ad_restricted_driver.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "ad_restricted_drivers",
  primaryKey: "id",

  attributes: {
    createdAt: false,
    updatedAt: false,
    ad_id: {
      model: "ad",
    },
    driver_id: {
      model: "driver",
    },
  },
};
