const bcrypt = require("bcryptjs");
const strings = sails.config.strings;
module.exports = {
  friendlyName: "Change password",

  description: "Change password vendor",

  inputs: {
    vendor: {
      type: "ref",
      required: true,
      description: "logged in vendor",
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
    sails.log("calling action vendor/change-password");

    vendor = inputs.vendor;

    let id = vendor.id;
    let old_password = inputs.old_password;
    let password = inputs.password;

    sails.log("checking if vendor has entered correct old password");
    bcrypt.compare(
      old_password.toString(),
      vendor.password,
      function (err, res) {
        if (err) {
          console.log("err:", err);
        }
        if (res !== true) {
          sails.log.warn(
            `vendor_id ${vendor.id} has entered the wrong old password`
          );
          return exits.ok({
            status: false,
            message: strings[inputs.vendor.language].INCORRECT_OLD_PASSWORD,
            data: [],
          });
        }
      }
    );

    ////////////
    sails.log("checking if vendor is trying to set old password");
    bcrypt.compare(password.toString(), vendor.password, function (err, res) {
      if (err) {
        console.log("err:", err);
      }
      if (res === true) {
        sails.log.warn(`vendor_id ${vendor.id} has entered the old password`);
        return exits.ok({
          status: false,
          message: strings[inputs.vendor.language].YOU_ENTERED_OLD_PASSWORD,
          data: [],
        });
      }
      sails.log(`Encrypting vendor password`);
      bcrypt
        .hash(password, 12)
        .then(async (hashedPassword) => {
          sails.log(`Password encrypted, now updating password`);
          try {
            var vendor = await Vendor.updateOne({ id: id }).set({
              password: hashedPassword,
            });

            if (vendor.id) {
              sails.log(`vendor password has been changed`);
              delete vendor.password;

              return exits.success({
                status: true,
                data: vendor,
                message: strings[inputs.vendor.language].CHANGED,
              });
            }
          } catch (err) {
            sails.log.error(
              `Error changing password for vendor id ${inputs.vendor.id}: ${err}`
            );
            return exits.serverError({
              status: false,
              message: strings[inputs.vendor.language].UNABLE_TO_CHANGE,
            });
            // …
          }
        })
        .catch((err) => {
          sails.log.error(
            `Error changing password for vendor id ${inputs.vendor.id}: ${err}`
          );
          return exits.serverError({
            status: false,
            message: strings[inputs.vendor.language].UNABLE_TO_CHANGE,
          });
        });
    });
  },
};
