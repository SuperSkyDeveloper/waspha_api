/**
 * Promo_code.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "promo_codes",
  primaryKey: "id",
  attributes: {
    category_id: {
      model: "category",
    },
    subcategory_id: {
      model: "category",
    },
    status_id: {
      model: "status",
    },
    promo_code: {
      type: "string",
      required: true,
    },
    is_requested: {
      type: "boolean",
      required: false,
      defaultsTo: false,
    },
    country_id: {
      model: "country",
    },
    discount: {
      type: "number",
      required: true,
    },
    discount_type: {
      type: "string",
      required: false,
      defaultsTo: "percentage",
    },
    description: {
      type: "string",
      required: false,
      allowNull: true,
    },
    image: {
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
    min_order_amount: {
      type: "number",
      required: false,
    },
    max_discount: {
      type: "number",
      required: false,
    },
    number_of_uses: {
      type: "number",
      required: false,
    },
    payment_methods: {
      type: "string",
      required: false,
    },
    service_modes: {
      type: "string",
      required: false,
    },
    apply_on: {
      type: "string",
      required: false,
      defaultsTo: global.PROMO_APPLY_ON.SUBTOTAL,
    },
    deletedAt: {
      type: "ref",
      columnType: "datetime",
      required: false,
    },
  },
};
