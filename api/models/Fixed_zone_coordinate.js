/**
 * Fixed_zone_coordinate.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "fixed_zone_coordinates",
  primaryKey: "id",
  attributes: {
    fixed_zone_id: {
      model: "fixed_zone",
    },
    latitude: {
      type: "number",
      required: true,
    },
    longitude: {
      type: "number",
      required: true,
    },
    deletedAt: {
      type: "ref",
      columnType: "datetime",
      required: false,
    },
  },
  customToJSON: function () {
    return _.omit(this, [
      "createdAt",
      "updatedAt",
      "deletedAt",
      "id",
      "fixed_zone_id",
    ]);
  },
};
