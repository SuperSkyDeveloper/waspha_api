/**
 * Vendor.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "vendors",
  primaryKey: "id",
  attributes: {
    id: {
      type: "number",
      autoIncrement: true,
    },
    is_device_active: {
      type: "boolean",
      required: false,
    },
    name: {
      type: "string",
      required: true,
    },
    email: {
      type: "string",
      required: true,
      unique: true,
      isEmail: true,
    },
    contact: {
      type: "string",
      unique: true,
      required: false,
      allowNull: true,
    },
    country_code: {
      type: "string",
      allowNull: true,
    },
    password: {
      type: "string",
      required: false,
      allowNull: true,
    },
    status: {
      type: "number",
      defaultsTo: 0,
    },
    otp: {
      type: "number",
      required: false,
    },
    language: {
      type: "string",
      required: false,
      defaultsTo: "en",
      isIn: ["en", "ar"],
    },
    avatar: {
      type: "string",
      required: false,
      allowNull: true,
    },
    device_id: {
      type: "string",
      required: false,
      allowNull: true,
    },
    loyalty_points: {
      type: "number",
      defaultsTo: 0,
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
    store: {
      collection: "store",
      via: "vendor_id",
    },
  },
  beforeValidate: function (values, cb) {
    Vendor.findOne({ email: values.email }).exec(function (err, record) {
      uniqueEmail = !err && !record;
      cb();
    });
  },
};
