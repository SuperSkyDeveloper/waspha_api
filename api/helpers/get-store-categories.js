module.exports = {
  friendlyName: "Get store categories",

  description: "",

  inputs: {
    store_id: {
      type: "number",
      required: true,
    },
    parent_id: {
      type: "number",
      required: false,
    },
    include_all: {
      type: "boolean",
      required: false,
      defaultsTo: false,
      description: "Include categories which have no products as well",
    },
  },

  exits: {
    success: {
      outputFriendlyName: "Store categories",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper get-store-categories");
    try {
      let product_category_ids = [];
      var where = {
        store_id: inputs.store_id,
        deletedAt: null,
      };
      let product_categories = await Store_product.find({
        where: where,
        select: ["category_id"],
      });
      if (product_categories && inputs.include_all == false) {
        product_category_ids = _.without(
          _.map(product_categories, "category_id"),
          null
        );
        where.id = product_category_ids;
      }

      if (!_.isUndefined(inputs.parent_id)) {
        if (inputs.parent_id == 0) {
          where.parent_id = null;
        } else {
          where.parent_id = inputs.parent_id;
        }
      }

      var categories = await Business_category.find({
        where: where,
        select: [
          "id",
          "parent_id",
          "name",
          "name_ar",
          "slug",
          "image",
          "image_ar",
          "description",
          "description_ar",
        ],
      });
      if (categories.length) {
        for (cat of categories) {
          cat.name = {
            en: cat.name,
            ar: cat.name_ar,
          };
          cat.image = {
            en: cat.image,
            ar: cat.image_ar,
          };
          cat.description = {
            en: cat.description,
            ar: cat.description_ar,
          };
          delete cat.name_ar;
          delete cat.image_ar;
          delete cat.description_ar;
        }
        sails.log(`${categories.length} store categories found`);
        return exits.success(categories);
      }
      sails.log(`No store categories found`);
      return exits.success([]);
    } catch (err) {
      sails.log.error(
        `Error getting store categories for store id ${inputs.store_id}. Error: ${err}`
      );
      return exits.success([]);
    }
  },
};
