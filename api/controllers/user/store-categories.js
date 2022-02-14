const { initConfig } = require("grunt");

module.exports = {
  friendlyName: "Store categories",

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
    parent_id: {
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
    sails.log("calling action user/store-categories");

    var data = [];

    if (!_.isUndefined(inputs.parent_id)) {
      data = await sails.helpers.getStoreCategories(
        inputs.store_id,
        inputs.parent_id
      );
    } else {
      data = await sails.helpers.getStoreCategories(inputs.store_id);
    }

    if (data.length) {
      return exits.success({
        status: true,
        message: sails.config.strings[inputs.language].CATEGORIES_FOUND.replace(
          "{total}",
          data.length
        ),
        data: data,
      });
    }
    return exits.ok({
      status: true,
      message: sails.config.strings[inputs.language].CATEGORIES_NOT_FOUND,
      data: [],
    });
  },
};
