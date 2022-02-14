module.exports = {
  friendlyName: "Change language user",

  description: "",

  inputs: {
    user: {
      type: "ref",
      required: true,
      description: "logged in user",
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
      inputs.user.id,
      inputs.language.toLowerCase(),
      global.ROLE.USER
    );
    let user_language = inputs.user.language;

    if (changed) {
      return exits.success({
        status: true,
        message: sails.config.strings[user_language].LANGUAGE_CHANGED,
        data: [],
      });
    }
    return exits.ok({
      status: true,
      message: sails.config.strings[user_language].UNABLE_TO_CHANGE_LANGUAGE,
      data: [],
    });
  },
};
