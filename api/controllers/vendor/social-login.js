module.exports = {
  friendlyName: "Social login vendor",

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
    sails.log("calling action vendor/social-login");
    const strings = sails.config.strings[inputs.language];

    var response = null;
    var rec = {};
    switch (inputs.token_type) {
      case "facebook": {
        response = await sails.helpers.general.fbLogin(
          inputs.token,
          global.ROLE.VENDOR
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
      var vendor = await Vendor.findOne({ email: response.email });
      if (!vendor) {
        vendor = await Vendor.create(rec).fetch();
      }
      vendor["is_approved"] = vendor.status == 1 ? true : false;
      vendor = await sails.helpers.jwt.generateToken.with({
        user: { ...vendor },
      });

      return exits.success({
        status: true,
        data: vendor,
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
