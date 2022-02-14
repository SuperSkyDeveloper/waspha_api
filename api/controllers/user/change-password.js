const bcrypt = require("bcryptjs");
module.exports = {
  friendlyName: "Change password user",

  description: "",

  inputs: {
    user: {
      type: "ref",
      required: true,
      description: "logged in user",
    },
    old_password: {
      type: "string",
      required: true,
    },
    password: {
      type: "string",
      required: true,
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
    sails.log("calling action user/change-password");
    const strings = sails.config.strings[inputs.user.language];
    user = inputs.user;

    let id = user.id;
    let old_password = inputs.old_password;
    let password = inputs.password;

    sails.log("checking if vendor has entered correct old password");
    bcrypt.compare(old_password.toString(), user.password, function (err, res) {
      if (err) {
        console.log("err:", err);
      }
      if (res !== true) {
        sails.log.warn(`user_id ${user.id} has entered the wrong old password`);
        return exits.ok({
          status: false,
          message: strings.INCORRECT_OLD_PASSWORD,
          data: [],
        });
      }
    });

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
              sails.log(`user password has been changed`);
              delete user.password;

              return exits.success({
                status: true,
                data: user,
                message: strings.PASSWORD_CHANGED,
              });
            }
          } catch (err) {
            sails.log.error(
              `Error changing password for user id ${inputs.user.id}: ${err}`
            );
            return exits.serverError({
              status: false,
              message: strings.UNABLE_TO_CHANGE,
            });
            // …
          }
        })
        .catch((err) => {
          sails.log.error(
            `Error changing password for user id ${inputs.user.id}: ${err}`
          );
          return exits.serverError({
            status: false,
            message: strings.UNABLE_TO_CHANGE,
          });
        });
    });
  },
};
