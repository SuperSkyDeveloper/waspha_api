/**
 * Country.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "waspha_countries",
  primaryKey: "id",

  attributes: {
    createdAt: false,
    updatedAt: false,
    country_id: {
      model: "country",
    },
  },
};
