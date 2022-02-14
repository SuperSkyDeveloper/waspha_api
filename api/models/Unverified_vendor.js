/**
 * Unverified_vendpr.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "unverified_vendors",
  primaryKey: "id",

  attributes: {
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
      required: true,
    },
    country_code: {
      type: "string",
      allowNull: true,
    },
    password: {
      type: "string",
      required: true,
    },
    otp: {
      type: "number",
      required: true,
    },
    referral_code: {
      type: "string",
      required: false,
      allowNull: true,
    },
  },
  beforeValidate: function (values, cb) {
    User.findOne({ email: values.email }).exec(function (err, record) {
      uniqueEmail = !err && !record;
      cb();
    });
  },
};
