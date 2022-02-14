/**
 * Driver_fixed_zone.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "driver_fixed_zones",
  primaryKey: "id",

  attributes: {
    fixed_zone_id: {
      model: "fixed_zone",
    },
    driver_id: {
      model: "driver",
    },
    createdAt: false,
    updatedAt: false,
  },
};
