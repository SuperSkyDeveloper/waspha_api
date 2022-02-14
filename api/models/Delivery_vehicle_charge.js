/**
 * Delivery_vehicle_charge.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "delivery_vehicle_charges",
  primaryKey: "id",

  attributes: {
    country: {
      model: "country",
    },
    delivery_vehicle: {
      model: "delivery_vehicle",
    },

    base_fee: {
      type: "number",
    },

    fee_per_minute: {
      type: "number",
    },
    fee_per_km: {
      type: "number",
    },
  },
};
