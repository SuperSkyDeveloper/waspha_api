/**
 * User_address.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "user_addresses",
  primaryKey: "id",

  attributes: {
    id: {
      type: "number",
      autoIncrement: true,
    },
    user_id: {
      model: "user",
    },
    title: {
      type: "string",
      required: true,
    },
    phone: {
      type: "string",
      required: true,
    },
    landmark: {
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
    deletedAt: {
      type: "ref",
      columnType: "datetime",
      required: false,
    },
  },
};
