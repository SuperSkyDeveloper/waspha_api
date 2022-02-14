module.exports = {
  friendlyName: "Get searched business categories",

  description: "",

  inputs: {
    store_id: {
      type: "number",
      required: true,
    },
    search_text: {
      type: "string",
      required: true,
    },
  },

  exits: {
    success: {
      outputFriendlyName: "Searched business categories",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper get-seaerched-business categories");
    const store_id = inputs.store_id;
    const search_text = inputs.search_text;
    try {
      var business_categories = await Business_category.find({
        where: {
          deletedAt: null,
          store_id: store_id,
          name: {
            contains: search_text,
          },
        },
        select: ["name", "description", "image", "parent_id"],
      });
      sails.log({ business_categories: business_categories });
      if (business_categories.length) {
        return exits.success(business_categories);
      }
      return exits.success([]);
    } catch (err) {
      sails.log.error(
        `Error searching business categories for store id ${inputs.store_id}. ${err}`
      );
      return exits.success([]);
    }
  },
};
