/**
 * Vendor_reason.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "setting_options",
  primaryKey: "id",

  attributes: {
    id: {
      type: "number",
      autoIncrement: true,
    },
    setting_id: {
      model: "setting",
    },
    value: {
      type: "string",
      columnType: "text",
      required: true,
    },
    en: {
      type: "string",
      columnType: "text",
      required: false,
    },
    ar: {
      type: "string",
      columnType: "text",
      required: false,
    },
  },
  customToJSON: function () {
    return _.omit(this, ["createdAt", "updatedAt", "setting_id", "value"]);
  },
};
