/**
 * driver_notification.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "driver_notifications",
  primaryKey: "id",

  attributes: {
    id: {
      type: "number",
      autoIncrement: true,
    },
    driver_id: {
      model: "driver",
    },
    template_id: {
      model: "notification_template",
    },
    title: {
      type: "string",
      required: false,
      allowNull: true,
    },
    body: {
      type: "string",
      required: false,
      allowNull: true,
    },
    extra_data: {
      type: "string",
      columnType: "text",
      required: true,
    },
    notification_type: {
      type: "string",
      required: false,
    },
    is_read: {
      type: "boolean",
      required: false,
      defaultsTo: false,
    },
    deletedAt: {
      type: "ref",
      columnType: "datetime",
      required: false,
    },
  },
};
