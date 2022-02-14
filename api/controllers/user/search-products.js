module.exports = {
  friendlyName: "Search products user",

  description: "",

  inputs: {
    user: {
      type: "ref",
      required: false,
      description: "logged in user",
    },
    language: {
      type: "string",
      required: false,
      defaultsTo: "en",
    },
    store_id: {
      type: "number",
      required: true,
    },
    search_text: {
      type: "string",
      minLength: 1,
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
    sails.log("calling action user/search-products");
    var data = {};
    data.products = await sails.helpers.getSearchedProducts(
      inputs.store_id,
      inputs.search_text
    );
    data.categories = await sails.helpers.getSearchedBusinessCategories(
      inputs.store_id,
      inputs.search_text
    );
    if (!_.isEmpty(data)) {
      return exits.success({
        status: true,
        message: sails.config.strings[inputs.language].PRODUCTS_FOUND.replace(
          "{total}",
          data.products.length
        ),
        data: data,
      });
    }

    return exits.ok({
      status: false,
      message: sails.config.strings[inputs.language].PRODUCTS_NOT_FOUND,
      data: [],
    });
  },
};
