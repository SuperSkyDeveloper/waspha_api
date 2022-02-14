/**
 * Store_service.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "store_services",
  primaryKey: "id",
  attributes: {
    createdAt: false,
    updatedAt: false,
    store: {
      model: "store",
    },
    waspha_box: {
      type: "boolean",
      required: false,
    },
    waspha_express: {
      type: "boolean",
      required: false,
    },
    delivery: {
      type: "boolean",
      required: false,
    },
    pickup: {
      type: "boolean",
      required: false,
    },
  },
};
