/**
 * Waspha_commission.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "waspha_commissions",
  primaryKey: "id",

  attributes: {
    country: {
      model: "country",
    },

    waspha_fee_delivery: {
      type: "number",
    },
    waspha_fee_delivery_type: {
      type: "string",
      required: true,
    },
    waspha_fee_pickup: {
      type: "number",
    },
    waspha_fee_pickup_type: {
      type: "string",
      required: true,
    },
  },
};
