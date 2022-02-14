const bcrypt = require("bcryptjs");
module.exports = {
  friendlyName: "Reset password user",

  description: "",

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
      defaultsTo: "en",
    },
  },

  exits: {
    invalid: {
      responseType: "unauthorized",
      description: "Send 401 if authentication failed",
    },
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
    sails.log("calling action user/reset-password");
    const strings = sails.config.strings[inputs.language];
    var is_email = _.isString(inputs.user_id);
    if (is_email) {
      var user_id = inputs.user_id.toLowerCase();

      user = await User.findOne({ email: user_id });
      var message = strings.CODE_SENT_TO_EMAIL_USER;
    } else {
      user = await User.findOne({
        contact: inputs.user_id.number.replace(/\s/g, ""),
        country_code: inputs.user_id.country_code,
      });
      message = strings.CODE_SENT_TO_PHONE_USER;
    }

    if (!user) {
      sails.log.warn(
        `user with email or contact '${inputs.user_id}' not exists, returning response`
      );
      return exits.ok({
        status: false,
        message: strings.INVALID_USER_ID,
        data: [],
      });
    }
    let id = user.id;
    let password = inputs.password;

    ////////////
    sails.log("checking if user is trying to set old password");
    bcrypt.compare(password.toString(), user.password, function (err, res) {
      if (err) {
        console.log("err:", err);
      }
      if (res === true) {
        sails.log.warn(`user_id ${user.id} has entered the wrong password`);
        return exits.ok({
          status: false,
          message: strings.YOU_ENTERED_OLD_PASSWORD,
          data: [],
        });
      }
      sails.log(`Encrypting user password`);
      bcrypt
        .hash(password, 12)
        .then(async (hashedPassword) => {
          sails.log(`Password encrypted, now updating password`);
          try {
            var user = await User.updateOne({ id: id }).set({
              password: hashedPassword,
            });

            console.log("new user:", user);
            if (user.id) {
              sails.log(`user password has been reset`);
              delete user.password;

              return exits.success({
                status: true,
                message: strings.PASSWORD_RESET,
                data: user,
              });
            }
          } catch (err) {
            sails.log.error(`Error resetting password, Error: ${err}`);
            return exits.serverError({
              status: false,
              message: strings.UNABLE_TO_RESET_PASSWORD,
              data: [],
            });
          }
        })
        .catch((err) => {
          sails.log.error(`Error resetting password, Error: ${err}`);
          return exits.serverError({
            status: false,
            message: strings.UNABLE_TO_RESET_PASSWORD,
            data: [],
          });
        });
    });
  },
};
