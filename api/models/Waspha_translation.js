/**
 * Waspha_translation.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "waspha_translations",
  primaryKey: "id",

  attributes: {
    key: {
      type: "string",
      required: true,
    },
    en: {
      type: "string",
      // columnType: "longtext",
      required: true,
    },
    ar: {
      type: "string",
      //columnType: "longtext",
      required: false,
      allowNull: true,
    },
  },
};
