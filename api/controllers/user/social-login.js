module.exports = {
  friendlyName: "Social login",

  description: "",

  inputs: {
    token: {
      type: "string",
      required: true,
    },
    token_type: {
      type: "string",
      required: true,
      isIn: ["facebook", "google"],
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
    serverError: {
      description: "send server error",
      responseType: "serverError",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action user/social-login");

    const strings = sails.config.strings[inputs.language];
    var response = null;
    var rec = {};
    switch (inputs.token_type) {
      case "facebook": {
        response = await sails.helpers.general.fbLogin(
          inputs.token,
          global.ROLE.USER
        );
        if (_.isObject(response) && !_.isUndefined(response.email)) {
          rec = {
            name: response.name,
            email: response.email,
            avatar: response.picture.data.url || null,
          };
        }
        break;
      }
      case "google": {
        response = await sails.helpers.general.googleLogin(inputs.token);

        if (_.isObject(response) && !_.isUndefined(response.email)) {
          rec = {
            name: `${response.given_name} ${response.family_name}`,
            email: response.email,
            avatar: response.picture || null,
          };
        }
        break;
      }
    }
    if (rec.email) {
      var user = await User.findOne({ email: response.email });
      if (!user) {
        user = await User.create(rec).fetch();
      }
      user = await sails.helpers.jwt.generateToken.with({ user: { ...user } });

      return exits.success({
        status: true,
        data: user,
        message: strings.LOGGED_IN,
      });
    }
    return exits.ok({
      status: false,
      message: strings.UNABLE_TO_LOGIN_INVALID_TOKEN,
      data: [],
    });
  },
};
