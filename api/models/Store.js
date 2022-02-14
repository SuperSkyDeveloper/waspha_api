/**
 * Store.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "stores",
  primaryKey: "id",

  attributes: {
    id: {
      type: "number",
      autoIncrement: true,
    },
    vendor_id: {
      model: "vendor",
      unique: true,
    },
    category_id: {
      model: "category",
    },
    business_name: {
      type: "string",
      required: true,
    },
    ar: {
      type: "string",
      required: false,
      allowNull: true,
    },
    country_code: {
      type: "string",
      required: true,
    },
    phone: {
      type: "string",
      required: true,
    },
    address: {
      type: "string",
      required: true,
    },
    lat: {
      type: "number",
      columnType: "double",
      required: true,
    },
    lng: {
      type: "number",
      columnType: "double",
      required: true,
    },
    delivery_range: {
      type: "number",
      required: true,
    },
    is_waspha_express_subscribed: {
      type: "boolean",
      required: false,
    },
    timings: {
      type: "string",
      required: true,
    },
    image: {
      type: "string",
      required: false,
      allowNull: true,
    },
    document: {
      type: "string",
      required: false,
      allowNull: true,
    },
    delivery: {
      type: "boolean",
      required: false,
      defaultsTo: true,
    },
    pickup: {
      type: "boolean",
      required: false,
      defaultsTo: true,
    },
    is_online: {
      type: "boolean",
      required: false,
      defaultsTo: false,
    },
    proposal_prep_time: {
      type: "number",
      required: false,
      allowNull: true,
    },
    proposal_selection_time: {
      type: "number",
      required: false,
      allowNull: true,
    },
    waspha_fee_delivery: {
      type: "number",
      required: false,
      defaultsTo: 5,
    },
    waspha_fee_delivery_type: {
      type: "string",
      required: false,
      defaultsTo: "percentage",
    },
    waspha_fee_pickup: {
      type: "number",
      required: false,
      defaultsTo: 5,
    },
    waspha_fee_pickup_type: {
      type: "string",
      required: false,
      defaultsTo: "percentage",
    },
    credit_amount: {
      type: "number",
      required: false,
    },
    debit_amount: {
      type: "number",
      required: false,
    },

    deletedAt: {
      type: "ref",
      columnType: "datetime",
      required: false,
    },
    request_for_proposals: {
      collection: "request_for_proposal",
      via: "store_id",
      through: "request_for_proposal_store",
    },
    slots: {
      collection: "store_timing",
      via: "store_id",
    },
    categories: {
      collection: "store_subcategory",
      via: "store_id",
    },
  },
};
