const { initConfig } = require("grunt");

module.exports = {
  friendlyName: "Store products",

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
    sails.log("calling action user/store-products");

    var data = [];
    if (inputs.type) {
      data = await sails.helpers.getTrendingProducts(inputs.store_id);
    }

    if (!_.isUndefined(inputs.category_id)) {
      data = await sails.helpers.getStoreProducts(
        inputs.store_id,
        inputs.category_id
      );
    }
    if (data.length < 1) {
      data = await sails.helpers.getStoreProducts(inputs.store_id);
    }

    if (data.length) {
      // let menu_promotions = await sails.helpers.getMenuPromotions();
      // for (item of data) {
      //   if (item.id) {
      //     item.menu_promotion = await sails.helpers.getMenuPromotion(
      //       item.id,
      //       menu_promotions
      //     );
      //   }
      // }
      return exits.success({
        status: true,
        message: sails.config.strings[inputs.language].PRODUCTS_FOUND.replace(
          "{total}",
          data.length
        ),
        data: data,
      });
    }
    return exits.ok({
      status: true,
      message: sails.config.strings[inputs.language].PRODUCTS_NOT_FOUND,
      data: [],
    });
  },
};
