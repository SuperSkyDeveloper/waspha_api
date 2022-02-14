/**
 * Proposal.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "proposals",
  primaryKey: "id",

  attributes: {
    rfp_store_id: {
      model: "request_for_proposal_store",
    },
    status_id: {
      model: "status",
    },
    delivery_mode_id: {
      model: "delivery_mode",
    },
    is_delivery_mode_changed: {
      type: "boolean",
      required: false,
    },
    delivery_vehicle_id: {
      model: "delivery_vehicle",
    },
    promo_code_id: {
      model: "promo_code",
    },
    delivery_fee: {
      type: "number",
      required: false,
      defaultsTo: 0,
    },
    old_delivery_fee: {
      type: "number",
      required: false,
      defaultsTo: 0,
    },
    eta: {
      type: "string",
      //  columnType: 'datetime',
      required: false,
      allowNull: true,
    },
    type: {
      type: "string",
      maxLength: 10,
      isIn: ["delivery", "pickup"],
      defaultsTo: "delivery",
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
    is_read: {
      type: "boolean",
      required: false,
      defaultsTo: false,
    },
    is_revised: {
      type: "boolean",
      required: false,
      defaultsTo: false,
    },
    revision_number: {
      type: "number",
      required: false,
      defaultsTo: 0,
    },
    payment_method: {
      type: "string",
      required: false,
      allowNull: true,
    },
    payment_reference: {
      type: "string",
      required: false,
      allowNull: true,
    },
    credit_amount: {
      type: "number",
      required: false,
    },
    debit_amount: {
      type: "number",
      required: false,
    },
    total_earning: {
      type: "number",
      required: false,
    },
    store_id: {
      model: "store",
    },
    order_type: {
      type: "string",
      required: false,
      defaultsTo: global.ORDER_TYPE.NORMAL,
    },
    package_charges: {
      type: "number",
      required: false,
      allowNull: true,
    },
    waiting_toll: {
      type: "number",
      required: false,
      allowNull: true,
    },
    pickup_location: {
      type: "string",
      required: false,
      allowNull: true,
    },
    delivery_location: {
      type: "string",
      required: false,
      allowNull: true,
    },

    deletedAt: {
      type: "ref",
      columnType: "datetime",
      required: false,
    },
    items: {
      collection: "proposal_item",
      via: "proposal_id",
    },
  },
};
