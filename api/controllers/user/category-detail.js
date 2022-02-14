module.exports = {
  friendlyName: "Category detail",

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
    category_id: {
      type: "number",
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
    sails.log("calling action user/category-detail");

    var data = {};

    if (!_.isUndefined(inputs.category_id)) {
      data = await sails.helpers.getCategory(inputs.category_id);
    }

    if (!_.isEmpty(data)) {
      return exits.success({
        status: true,
        message: sails.config.strings[inputs.language].FOUND,
        data: data,
      });
    }
    return exits.ok({
      status: true,
      message: sails.config.strings[inputs.language].NOT_FOUND,
      data: [],
    });
  },
};
