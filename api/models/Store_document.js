/**
 * Store_timing.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "store_documents",

  attributes: {
    store_id: {
      model: "store",
    },
    document: {
      type: "string",
      required: true,
    },
  },
};
