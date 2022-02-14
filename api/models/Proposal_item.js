/**
 * Proposal_item.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "proposal_items",
  primaryKey: "id",

  attributes: {
    proposal_id: {
      model: "proposal",
    },
    product_id: {
      model: "store_product",
    },
    title: {
      type: "string",
      required: false,
      allowNull: true,
    },
    price: {
      type: "number",
      required: false,
      min: 1,
      allowNull: true,
    },
    quantity: {
      type: "number",
      required: true,
      min: 1,
    },
    tax_ratio: {
      type: "number",
      required: false,
      allowNull: true,
    },
    requirements: {
      type: "string",
      columnType: "text",
      required: false,
      allowNull: true,
    },
    remarks: {
      type: "string",
      //columnType: 'text',
      required: false,
      allowNull: true,
    },
    image: {
      type: "string",
      required: false,
      allowNull: true,
    },
    remarks_image: {
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
