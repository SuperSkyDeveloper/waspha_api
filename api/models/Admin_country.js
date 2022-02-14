/**
 * Admin_country.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "admin_country",
  primaryKey: "id",

  attributes: {
    admin_id: {
      model: "admin",
    },
    country_id: {
      model: "country",
    },
  },
};
