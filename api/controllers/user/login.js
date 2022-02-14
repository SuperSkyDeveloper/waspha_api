const bcrypt = require("bcryptjs");

module.exports = {
  friendlyName: "Login",

  description: "Login user.",

  inputs: {
    user_id: {
      type: "json",
      required: true,
      custom: function (value) {
        return (
          (_.isObject(value) &&
            !_.isUndefined(value.country_code) &&
            !_.isUndefined(value.phone_number) &&
            !_.isUndefined(value.number)) ||
          _.isString(value)
        );
      },
    },
    password: {
      type: "string",
      required: true,
    },
    language: {
      type: "string",
      required: false,
      allowNull: true,
    },
  },
  exits: {
    invalid: {
      responseType: "unauthorized",
      description: "Send 401 if authentication failed",
    },
    unauthorized: {
      responseType: "unauthorized",
      description: "Send 401 if authentication failed",
    },
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
    sails.log("calling action user/login");
    let language = !_.isUndefined(inputs.language) ? inputs.language : "en";

    let loaded_user;
    var user_id = inputs.user_id.toLowerCase();
    user_id = user_id.replace(/\s/g, "");
    const password = inputs.password;

    let user = await User.findOne({ email: user_id });
    message = sails.config.strings[language].INVALID_USER_ID_OR_PASSWORD;
    if (!user) {
      user = await User.findOne({ contact: user_id.replace(/^0+/, "") });
    }

    if (!user) {
      sails.log.warn(`user has entered the invalid id`);
      return exits.ok({
        status: false,
        message: message,
        data: [],
      });
    }
    if (!user.password) {
      sails.log.warn(`user does not have password`);
      return exits.ok({
        status: false,
        message: message,
        data: [],
      });
    }
    ////
    loaded_user = user;
    bcrypt
      .compare(password.toString(), user.password)
      .then(async (isEqual) => {
        if (!isEqual) {
          sails.log.warn(
            `user_id ${loaded_user.id} has entered the wrong password`
          );

          return exits.ok({
            status: false,
            message: message,
            data: [],
          });
        }
        user = await sails.helpers.general.getLoggedinUser(
          loaded_user.id,
          inputs,
          global.ROLE.USER
        );
        //#endregion verified & unverified
        return exits.success({
          status: true,
          message: sails.config.strings[language].LOGGED_IN,
          data: user,
        });
      })
      .catch((err) => {
        sails.log(`Error logging in user, Error: ${err}`);
        return exits.ok({
          status: false,
          message: sails.config.strings[language].UNABLE_TO_LOGIN,
          data: [],
        });
      });
  },
};
