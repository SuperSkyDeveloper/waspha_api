/**
 * Vendor_reason.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "settings",
  primaryKey: "id",

  attributes: {
    id: {
      type: "number",
      autoIncrement: true,
    },
    key: {
      type: "string",
      required: true,
    },
    display_name: {
      type: "string",
      required: true,
    },
    value: {
      type: "string",
      columnType: "text",
      required: false,
      allowNull: true,
    },
    options: {
      collection: "setting_option",
      via: "setting_id",
    },
  },
};
