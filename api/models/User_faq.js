/**
 * Faq.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "user_faqs",
  primaryKey: "id",

  attributes: {
    id: {
      type: "number",
      autoIncrement: true,
    },
    title: {
      type: "string",
      required: true,
    },
    title_ar: {
      type: "string",
      required: false,
    },
    description: {
      type: "string",
      columnType: "text",
      required: true,
    },
    description_ar: {
      type: "string",
      columnType: "text",
      required: false,
    },
  },
};
