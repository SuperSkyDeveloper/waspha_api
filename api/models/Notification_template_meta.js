/**
 * Notification_template_meta.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "notification_templates_meta",
  primaryKey: "id",

  attributes: {
    id: {
      type: "number",
      autoIncrement: true,
    },
    notification_template_id: {
      model: "notification_template",
    },
    key: {
      type: "string",
      required: true,
    },
    en: {
      type: "string",
      required: false,
      allowNull: true,
    },
    ar: {
      type: "string",
      required: false,
      allowNull: true,
    },
  },
};
