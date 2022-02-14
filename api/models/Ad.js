/**
 * Ad.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "ads",
  primaryKey: "id",
  attributes: {
    category_id: {
      model: "category",
    },
    subcategory_id: {
      model: "category",
    },

    is_requested: {
      type: "boolean",
      required: false,
      defaultsTo: false,
    },
    country_id: {
      model: "country",
    },
    type: {
      type: "string",
      required: false,
    },
    location: {
      type: "string",
      required: false,
    },
    radius: {
      type: "number",
      required: true,
    },
    description: {
      type: "string",
      required: false,
      allowNull: true,
    },
    media: {
      type: "string",
      required: false,
      allowNull: true,
    },
    start_time: {
      type: "ref",
      columnType: "datetime",
      required: false,
    },
    end_time: {
      type: "ref",
      columnType: "datetime",
      required: false,
    },
    service_modes: {
      type: "string",
      required: false,
    },

    deletedAt: {
      type: "ref",
      columnType: "datetime",
      required: false,
    },
  },
};
