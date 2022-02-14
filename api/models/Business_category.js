/**
 * Business_category.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "business_categories",
  primaryKey: "id",

  attributes: {
    id: {
      type: "number",
      autoIncrement: true,
    },
    store_id: {
      model: "store",
    },
    parent_id: {
      model: "business_category",
    },
    name: {
      type: "string",
      required: false,
      allowNull: true,
    },
    name_ar: {
      type: "string",
      required: false,
      allowNull: true,
    },
    slug: {
      type: "string",
      required: false,
      allowNull: true,
    },
    image: {
      type: "string",
      required: false,
      allowNull: true,
    },
    image_ar: {
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
    description_ar: {
      type: "string",
      columnType: "text",
      required: false,
      allowNull: true,
    },
    children: {
      collection: "business_category",
      via: "parent_id",
    },
    deletedAt: {
      type: "ref",
      columnType: "datetime",
      required: false,
    },
  },
  // beforeValidate: function(values, cb) {
  //   Category.findOne({slug: values.slug}).exec(function (err, record) {
  //       uniqueSlug = !err && !record;
  //       cb();
  //   });
  // }
};
