const { initConfig } = require("grunt");

module.exports = {
  friendlyName: "Store policy",

  description: "",

  inputs: {
    user: {
      type: "ref",
      required: false,
      description: "logged in user",
    },
    store_id: {
      type: "number",
      required: true,
    },
    language: {
      type: "string",
      required: false,
      defaultsTo: "en",
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
    sails.log("calling action user/store-policy");

    var data = {};
    let terms = await sails.helpers.getWasphaSettings(
      "terms_and_conditions_vendor"
    );

    if (terms.length) {
      data.policy = {
        en: terms[0].en,
        ar: terms[0].ar,
      };
      if (data) {
        return exits.success({
          status: true,
          message: sails.config.strings[inputs.language].FOUND,
          data: data,
        });
      }
    }

    return exits.ok({
      status: true,
      message: sails.config.strings[inputs.language].NOT_FOUND,
      data: [],
    });
  },
};
