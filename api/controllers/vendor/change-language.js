module.exports = {
  friendlyName: "Change language",

  description: "",

  inputs: {
    vendor: {
      type: "ref",
      required: true,
      description: "logged in vendor",
    },
    language: {
      type: "string",
      required: true,
      isIn: ["en", "ar", "EN", "AR"],
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
    let changed = await sails.helpers.general.changeLanguage(
      inputs.vendor.id,
      inputs.language.toLowerCase(),
      global.ROLE.VENDOR
    );
    let vendor_language = inputs.vendor.language;
    if (changed) {
      return exits.success({
        status: true,
        message: sails.config.strings[vendor_language].LANGUAGE_CHANGED,
        data: [],
      });
    }
    return exits.ok({
      status: true,
      message: sails.config.strings[vendor_language].UNABLE_TO_CHANGE_LANGUAGE,
      data: [],
    });
  },
};
