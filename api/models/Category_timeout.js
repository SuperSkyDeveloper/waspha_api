/**
 * Category_timeout.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "category_timeouts",
  primaryKey: "id",

  attributes: {
    createdAt: false,
    updatedAt: false,
    category: {
      model: "category",
    },
    country: {
      model: "country",
    },

    expiry_time: {
      type: "number",
    },

    unit: {
      type: "string",
      defaultsTo: "miniutes",
    },
  },
};
