/**
 * Category.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "categories",
  primaryKey: "id",

  attributes: {
    id: {
      type: "number",
      autoIncrement: true,
    },
    parent_id: {
      model: "category",
    },
    name: {
      type: "string",
      required: false,
      allowNull: true,
    },
    en: {
      type: "string",
      required: false,
    },
    ar: {
      type: "string",
      required: false,
    },
    slug: {
      type: "string",
      required: true,
      unique: true,
    },
    image: {
      type: "string",
      required: false,
      allowNull: true,
    },
    secondary_image: {
      type: "string",
      required: false,
      allowNull: true,
    },
    description: {
      type: "string",
      columnType: "text",
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
    Category.findOne({ slug: values.slug }).exec(function (err, record) {
      uniqueSlug = !err && !record;
      cb();
    });
  },
};
