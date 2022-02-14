module.exports = {
  friendlyName: "Get store category",

  description: "",

  inputs: {
    category_id: {
      type: "number",
      required: false,
    },
  },

  exits: {
    success: {
      outputFriendlyName: "Store category",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper get-store-category");
    try {
      var where = {
        id: inputs.category_id,
      };

      var category = await Category.find({
        where: where,
        select: [
          "id",
          "parent_id",
          "name",
          "en",
          "ar",
          "slug",
          "image",
          "description",
        ],
      }).limit(1);
      if (category.length) {
        sails.log(`${category.length} store category found`);
        category[0].name = {
          en: category[0].en,
          ar: category[0].ar,
        };

        return exits.success(category[0]);
      }
      sails.log(`No store category found`);
      return exits.success([]);
    } catch (err) {
      sails.log.error(
        `Error getting store category for store id ${inputs.store_id}. Error: ${err}`
      );
      return exits.success([]);
    }
  },
};
