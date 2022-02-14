/**
 * Fixed_zone.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "fixed_zones",
  primaryKey: "id",

  attributes: {
    id: {
      type: "number",
      autoIncrement: true,
    },
    name: {
      type: "string",
      required: true,
    },
    latlng: {
      collection: "fixed_zone_coordinate",
      via: "fixed_zone_id",
    },
    slots: {
      collection: "fixed_zone_allowed_slot",
      via: "fixed_zone_id",
    },
    drivers: {
      collection: "driver_fixed_zone",
      via: "fixed_zone_id",
    },
    deletedAt: {
      type: "ref",
      columnType: "datetime",
      required: false,
    },
  },
};
