/**
 * Waspha_commission_driver.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "waspha_commissions_driver",
  primaryKey: "id",

  attributes: {
    country: {
      model: "country",
    },

    waspha_fee_normal: {
      type: "number",
    },
    waspha_fee_normal_type: {
      type: "string",
      required: true,
    },

    waspha_fee_traditional: {
      type: "number",
    },
    waspha_fee_traditional_type: {
      type: "string",
      required: true,
    },
  },
};
