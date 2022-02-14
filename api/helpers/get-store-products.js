module.exports = {
  friendlyName: "Get store products",

  description: "",

  inputs: {
    store_id: {
      type: "number",
      required: true,
    },
    category_id: {
      type: "number",
      required: false,
      allowNull: true,
    },
  },

  exits: {
    success: {
      outputFriendlyName: "Store products",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper get-store-products");
    try {
      var where = {
        store_id: inputs.store_id,
        deletedAt: null,
      };
      if (!_.isUndefined(inputs.category_id)) {
        console.log("adid");
        where.category_id = inputs.category_id > 0 ? inputs.category_id : null;
      } else {
        var categories = await Business_category.find({
          where: { store_id: inputs.store_id, deletedAt: null },
          select: ["id"],
        });
        sails.log({ categories: categories });
        if (categories) {
          cat_ids = _.map(categories, "id");
          where.or = [{ category_id: cat_ids }, { category_id: null }];
        }
      }
      console.log("where:", where);

      var products = await Store_product.find({
        where: where,
        select: [
          "id",
          "store_id",
          "title",
          "title_ar",
          "description",
          "description_ar",
          "image",
          "image_ar",
          "category_id",
        ],
      });
      if (products.length) {
        let menu_promotions = await sails.helpers.getMenuPromotions();
        for (item of products) {
          item.title = {
            en: item.title,
            ar: item.title_ar,
          };
          item.image = {
            en: item.image,
            ar: item.image_ar,
          };
          item.description = {
            en: item.description,
            ar: item.description_ar,
          };
          delete item.title_ar;
          delete item.image_ar;
          delete item.description_ar;
          item.is_featured = false;
          if (item.id) {
            item.menu_promotion = await sails.helpers.getMenuPromotion(
              item.id,
              menu_promotions
            );
            if (item.menu_promotion) {
              item.is_featured = true;
            }
          }
        }
        sails.log(`${products.length} store products found`);
        return exits.success(products);
      }
      sails.log(`No store products found`);
      return exits.success([]);
    } catch (err) {
      sails.log.error(
        `Error getting store products for store id ${inputs.store_id}. Error: ${err}`
      );
      return exits.success([]);
    }
  },
};
