module.exports = {
  friendlyName: "Search products vendor",

  description: "",

  inputs: {
    vendor: {
      type: "ref",
      required: true,
      description: "logged in vendor",
    },
    search_text: {
      type: "string",
      required: true,
    },
  },

  exits: {
    serverError: {
      description: "send server error",
      responseType: "serverError",
    },
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action vendor/search-products");
    var data = {};
    data.products = await sails.helpers.getSearchedProducts(
      inputs.vendor.store.id,
      inputs.search_text
    );
    data.categories = await sails.helpers.getSearchedBusinessCategories(
      inputs.vendor.store.id,
      inputs.search_text
    );
    if (!_.isEmpty(data)) {
      return exits.success({
        status: true,
        message: sails.config.strings[
          inputs.vendor.language
        ].PRODUCTS_FOUND.replace("{total}", data.products.length),
        data: data,
      });
    }

    return exits.ok({
      status: true,
      message: sails.config.strings[inputs.vendor.language].PRODUCTS_NOT_FOUND,
      data: [],
    });
  },
};
