/**
 * Driver_document.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "driver_documents",

  attributes: {
    driver_id: {
      model: "driver",
    },
    document: {
      type: "string",
      required: true,
    },
    createdAt: false,
    updatedAt: false,
  },
};
