/**
 * Request_for_proposal_item.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "request_for_proposal_items",
  primaryKey: "id",
  attributes: {
    id: {
      type: "number",
      autoIncrement: true,
    },
    rfp_id: {
      model: "request_for_proposal",
    },
    product_id: {
      model: "store_product",
    },
    name: {
      type: "string",
      required: false,
      allowNull: true,
    },
    quantity: {
      type: "number",
      required: true,
    },
    description: {
      type: "string",
      columnType: "text",
      required: false,
      allowNull: true,
    },
    requirements: {
      type: "string",
      columnType: "text",
      required: false,
      allowNull: true,
    },
    additional_notes: {
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
    deletedAt: {
      type: "ref",
      columnType: "datetime",
      required: false,
    },
  },
};
