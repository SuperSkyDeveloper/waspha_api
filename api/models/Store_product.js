/**
 * Store_product.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "store_products",
  primaryKey: "id",
  attributes: {
    id: {
      type: "number",
      autoIncrement: true,
    },
    store_id: {
      model: "store",
    },
    category_id: {
      model: "business_category",
    },
    subcategory_id: {
      model: "category",
    },
    title: {
      type: "string",
      required: false,
      allowNull: true,
    },
    title_ar: {
      type: "string",
      required: false,
      allowNull: true,
    },
    description: {
      type: "string",
      columnType: "text",
      required: false,
      allowNull: true,
    },
    description_ar: {
      type: "string",
      columnType: "text",
      required: false,
      allowNull: true,
    },
    image: {
      type: "string",
      required: false,
      allowNull: true,
    },
    image_ar: {
      type: "string",
      required: false,
      allowNull: true,
    },
    is_featured: {
      type: "boolean",
      defaultsTo: false,
    },
    deletedAt: {
      type: "ref",
      columnType: "datetime",
      required: false,
    },
  },
};
