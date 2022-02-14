/**
 * Fixed_zone_allowed_slot.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
module.exports = {
  datastore: "default",
  tableName: "fixed_zone_allowed_slots",
  primaryKey: "id",
  attributes: {
    fixed_zone_id: {
      model: "fixed_zone",
    },
    vehicle_id: {
      model: "delivery_vehicle",
    },
    allowed_slots: {
      type: "number",
      required: true,
    },
    deletedAt: {
      type: "ref",
      columnType: "datetime",
      required: false,
    },
  },
};
