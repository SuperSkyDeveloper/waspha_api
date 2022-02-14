module.exports = {
  friendlyName: "Resume access token user",

  description: "",

  inputs: {
    refresh_token: {
      type: "string",
      required: true,
    },
    language: {
      type: "string",
      required: false,
      defaultsTo: "en",
    },
  },

  exits: {
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action user/resume-access-token");
    const strings = sails.config.strings[inputs.language];

    const user = await sails.helpers.general.resumeAccessToken(
      inputs.refresh_token,
      "user"
    );

    if (user !== false) {
      return exits.success({
        status: true,
        message: strings.TOKEN_RESUMED,
        data: user,
      });
    }

    return exits.success({
      status: false,
      message: strings.UNABLE_TO_RESUME_TOKEN,
      data: [],
    });
  },
};
