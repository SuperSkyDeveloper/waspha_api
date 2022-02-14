/**
 * Promotion_menu.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "menu_promotions",
  primaryKey: "id",

  attributes: {
    product_id: {
      model: "store_product",
    },
    type: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
      required: false,
      columnType: "text",
      allowNull: true,
    },
    expiry_time: {
      type: "ref",
      columnType: "datetime",
      required: true,
    },

    extra_data: {
      type: "string",
      columnType: "text",
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
