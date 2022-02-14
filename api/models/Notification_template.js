/**
 * Notification_template.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "notification_templates",
  primaryKey: "id",

  attributes: {
    id: {
      type: "number",
      autoIncrement: true,
    },
    notification_type: {
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
    meta: {
      collection: "notification_template_meta",
      via: "notification_template_id",
    },
  },
};
