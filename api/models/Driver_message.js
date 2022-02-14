/**
 * Driver_message.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "driver_messages",
  primaryKey: "id",

  attributes: {
    id: {
      type: "number",
      autoIncrement: true,
    },
    driver_id: {
      model: "driver",
    },
    message: {
      type: "string",
      required: true,
      columnType: "text",
    },
    deletedAt: {
      type: "ref",
      columnType: "datetime",
      required: false,
    },
  },
};
