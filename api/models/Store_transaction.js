/**
 * Store_transaction.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "store_transactions",
  primaryKey: "id",
  attributes: {
    id: {
      type: "number",
      autoIncrement: true,
    },
    store_id: {
      model: "store",
    },
    admin_id: {
      model: "admin",
    },
    amount_paid: {
      type: "number",
      required: false,
      defaultsTo: 0,
    },
    amount_received: {
      type: "number",
      required: false,
      defaultsTo: 0,
    },
  },
};
