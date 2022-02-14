const bcrypt = require("bcryptjs");
module.exports = {
  friendlyName: "Change password",

  description: "Change password driver",

  inputs: {
    driver: {
      type: "ref",
      required: true,
      description: "logged in driver",
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
    sails.log("calling action driver/change-password");

    driver = inputs.driver;

    let id = driver.id;
    let old_password = inputs.old_password;
    let password = inputs.password;

    sails.log("checking if driver has entered correct old password");
    bcrypt.compare(
      old_password.toString(),
      driver.password,
      function (err, res) {
        if (err) {
          console.log("err:", err);
        }
        if (res !== true) {
          sails.log.warn(
            `driver_id ${driver.id} has entered the wrong old password`
          );
          return exits.ok({
            status: false,
            message:
              sails.config.strings[inputs.driver.language]
                .INCORRECT_OLD_PASSWORD,
            data: [],
          });
        }
      }
    );

    ////////////
    sails.log("checking if driver is trying to set old password");
    bcrypt.compare(password.toString(), driver.password, function (err, res) {
      if (err) {
        console.log("err:", err);
      }
      if (res === true) {
        sails.log.warn(`driver_id ${driver.id} has entered the old password`);
        return exits.ok({
          status: false,
          message:
            sails.config.strings[inputs.driver.language]
              .YOU_ENTERED_OLD_PASSWORD,
          data: [],
        });
      }
      sails.log(`Encrypting driver password`);
      bcrypt
        .hash(password, 12)
        .then(async (hashedPassword) => {
          sails.log(`Password encrypted, now updating password`);
          try {
            var driver = await Driver.updateOne({ id: id }).set({
              password: hashedPassword,
            });

            if (driver.id) {
              sails.log(`driver password has been changed`);
              delete driver.password;

              return exits.success({
                status: true,
                data: driver,
                message:
                  sails.config.strings[inputs.driver.language].PASSWORD_CHANGED,
              });
            }
          } catch (err) {
            sails.log.error(
              `Error changing password for driver id ${inputs.driver.id}: ${err}`
            );
            return exits.serverError({
              status: false,
              message:
                sails.config.strings[inputs.driver.language].UNABLE_TO_CHANGE,
            });
            // …
          }
        })
        .catch((err) => {
          sails.log.error(
            `Error changing password for driver id ${inputs.driver.id}: ${err}`
          );
          return exits.serverError({
            status: false,
            message:
              sails.config.strings[inputs.driver.language].UNABLE_TO_CHANGE,
          });
        });
    });
  },
};
