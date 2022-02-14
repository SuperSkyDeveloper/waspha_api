module.exports = {
  friendlyName: "Store products",

  description: "",

  inputs: {
    vendor: {
      type: "ref",
      required: true,
      description: "logged in vendor",
    },
    type: {
      type: "string",
      required: false,
      isIn: ["trending"],
    },
    category_id: {
      type: "number",
      required: false,
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
    sails.log("calling action vendor/store-products");
    var data = {};
    if (inputs.type) {
      data = await sails.helpers.getTrendingProducts(inputs.vendor.store.id);
    }

    if (!_.isUndefined(inputs.category_id)) {
      data.products = await sails.helpers.getStoreProducts(
        inputs.vendor.store.id,
        inputs.category_id
      );
      data.categories = await sails.helpers.getStoreCategories.with({
        store_id: inputs.vendor.store.id,
        parent_id: inputs.category_id,
        include_all: true,
      });
    }
    if (_.isUndefined(inputs.type) && _.isUndefined(inputs.category_id)) {
      data.products = await sails.helpers.getStoreProducts(
        inputs.vendor.store.id
      );
      data.categories = await sails.helpers.getStoreCategories.with({
        store_id: inputs.vendor.store.id,
        include_all: true,
      });
    }

    if (data.products) {
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
