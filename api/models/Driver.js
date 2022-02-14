/**
 * Driver.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "drivers",
  primaryKey: "id",

  attributes: {
    id: {
      type: "number",
      autoIncrement: true,
    },
    store_id: {
      model: "store",
    },
    name: {
      type: "string",
      required: false,
      allowNull: true,
    },
    email: {
      type: "string",
      required: false,
      isEmail: true,
      allowNull: true,
    },
    country_code: {
      type: "string",
      required: true,
    },
    contact: {
      type: "string",
      unique: true,
      required: true,
    },
    password: {
      type: "string",
      required: false,
      allowNull: true,
    },
    otp: {
      type: "number",
      required: false,
      allowNull: true,
    },
    vehicle_id: {
      model: "delivery_vehicle",
    },
    vehicle_name: {
      type: "string",
      required: false,
      allowNull: true,
    },
    number_plate: {
      type: "string",
      required: false,
      allowNull: true,
    },
    delivery_mode_id: {
      model: "delivery_mode",
    },
    status: {
      type: "boolean",
      defaultsTo: true,
    },
    avatar: {
      type: "string",
      required: false,
      allowNull: true,
    },
    gender: {
      type: "string",
      required: false,
      allowNull: true,
      isIn: ["male", "female"],
    },
    language: {
      type: "string",
      required: false,
      defaultsTo: "en",
      isIn: ["en", "ar"],
    },
    is_online: {
      type: "boolean",
      defaultsTo: false,
    },
    address: {
      type: "string",
      required: false,
      allowNull: true,
    },
    lat: {
      type: "number",
      columnType: "double",
      required: false,
      allowNull: true,
    },
    lng: {
      type: "number",
      columnType: "double",
      required: false,
      allowNull: true,
    },
    document: {
      type: "string",
      required: false,
      allowNull: true,
    },
    type: {
      required: false,
      type: "string",
      isIn: ["online", "offline", "waspha_express"],
    },
    rc_id: {
      type: "string",
      required: false,
      allowNull: true,
    },
    rc_username: {
      type: "string",
      required: false,
      allowNull: true,
    },
    rc_email: {
      type: "string",
      required: false,
      allowNull: true,
    },

    device_token: {
      type: "string",
      required: false,
      allowNull: true,
    },
    loyalty_points: {
      type: "number",
      required: false,
    },
    zone_option: {
      type: "string",
      required: false,
      allowNull: true,
      isIn: Object.values(global.ZONE_OPTION),
    },
    free_zone_radius: {
      type: "number",
      required: false,
      allowNull: true,
    },
    is_zone_selected: {
      type: "number",
      required: false,
      defaultsTo: 0,
    },
    referral_code: {
      type: "string",
      required: false,
      allowNull: true,
    },
    referred_by: {
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
    is_email_verified: {
      type: "boolean",
      required: false,
    },
    is_contact_verified: {
      type: "boolean",
      required: false,
    },
    unverified_email: {
      type: "string",
      required: false,
      isEmail: true,
      allowNull: true,
    },
    unverified_country_code: {
      type: "string",
      required: false,
      allowNull: true,
    },
    unverified_contact: {
      type: "string",
      required: false,
      allowNull: true,
    },
    verify_email_otp: {
      type: "number",
      required: false,
      allowNull: true,
    },
    verify_contact_otp: {
      type: "number",
      required: false,
      allowNull: true,
    },
    deletedAt: {
      type: "ref",
      columnType: "datetime",
      required: false,
    },
  },
  beforeValidate: function (values, cb) {
    Driver.findOne({ email: values.email }).exec(function (err, record) {
      uniqueEmail = !err && !record;
      cb();
    });
  },
};
