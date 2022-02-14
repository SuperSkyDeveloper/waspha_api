/**
 * Country.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "countries",
  primaryKey: "id",

  attributes: {
    country_code: {
      type: "string",
      required: true,
      maxLength: 5,
    },
    en: {
      type: "string",
      required: true,
    },
    ar: {
      type: "string",
      required: true,
    },
    currency_code: {
      type: "string",
      required: false,
      allowNull: true,
      maxLength: 5,
    },
    alpha3: {
      type: "string",
      required: false,
      allowNull: true,
      maxLength: 5,
    },
    dial_code: {
      type: "string",
      required: false,
      allowNull: true,
      maxLength: 10,
    },
    flag: {
      type: "string",
      required: true,
    },
    // vehicle_charges: {
    //   collection: "delivery_vehicle_charge",
    //   via: "country",
    // },
  },
};
