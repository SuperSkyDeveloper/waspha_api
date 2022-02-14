/**
 * Delivery_mode.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "delivery_modes",
  primaryKey: "id",
  attributes: {
    name: {
      type: "string",
      required: true,
      unique: true,
    },
    display_name: {
      type: "string",
      required: true,
    },
    title: {
      type: "string",
      required: true,
    },
    title_ar: {
      type: "string",
      required: false,
      allowNull: true,
    },
    subtitle: {
      type: "string",
      required: true,
    },
    subtitle_ar: {
      type: "string",
      required: false,
      allowNull: true,
    },
    image: {
      type: "string",
      required: false,
      allowNull: true,
    },
    color_image: {
      type: "string",
      required: false,
      allowNull: true,
    },
    deletedAt: {
      type: "ref",
      columnType: "datetime",
      required: false,
    },
  },
};
