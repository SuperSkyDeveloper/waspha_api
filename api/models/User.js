/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "users",
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
    country_code: {
      type: "string",
      allowNull: true,
    },
    contact: {
      type: "string",
      required: false,
      allowNull: true,
    },
    password: {
      type: "string",
      required: false,
      allowNull: true,
    },
    gender: {
      type: "string",
      required: false,
      maxLength: 6,
      isIn: ["male", "female", "other"],
      allowNull: true,
    },
    dob: {
      type: "ref",
      columnType: "date",
      required: false,
    },
    otp: {
      type: "number",
      required: false,
    },
    avatar: {
      type: "string",
      required: false,
      allowNull: true,
    },
    language: {
      type: "string",
      required: false,
      defaultsTo: "en",
      isIn: ["en", "ar"],
    },
    loyalty_points: {
      type: "number",
      defaultsTo: 0,
    },
    wallet: {
      type: "number",
      defaultsTo: 0,
    },
    device_token: {
      type: "string",
      required: false,
      allowNull: true,
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
    reviews: {
      collection: "store_review_rating",
      via: "user_id",
    },
    addresses: {
      collection: "user_address",
      via: "user_id",
    },
  },
  beforeValidate: function (values, cb) {
    User.findOne({ email: values.email }).exec(function (err, record) {
      uniqueEmail = !err && !record;
      cb();
    });
  },
};
