const bcrypt = require("bcryptjs");

module.exports = {
  friendlyName: "Login",

  description: "Login vendor.",

  inputs: {
    vendor_id: {
      type: "string",
      required: true,
    },
    password: {
      type: "string",
      required: true,
    },
    language: {
      type: "string",
      required: false,
      isIn: ["en", "ar", "EN", "AR"],
      defaultsTo: "en",
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
    sails.log("calling action vendor/login");
    var vendor_id = inputs.vendor_id.toLowerCase();
    vendor_id = vendor_id.replace(/\s/g, "");
    const password = inputs.password;
    let vendor = await Vendor.findOne({ email: vendor_id });
    let message =
      sails.config.strings[inputs.language].INVALID_VENDOR_ID_OR_PASSWORD;
    if (!vendor) {
      vendor = await Vendor.findOne({ contact: vendor_id.replace(/^0+/, "") });
    }

    if (!vendor) {
      sails.log.warn(`vendor has entered the invalid id`);
      return exits.ok({
        status: false,
        message: message,
        data: [],
      });
    }
    if (!vendor.password) {
      sails.log.warn(`vendor does not have password`);
      return exits.ok({
        status: false,
        message: message,
        data: [],
      });
    }
    bcrypt
      .compare(password.toString(), vendor.password)
      .then(async (isEqual) => {
        console.log("isEqual: ", isEqual);
        if (!isEqual) {
          sails.log.warn(
            `vendor_id ${vendor.id} has entered the wrong password`
          );

          return exits.ok({
            status: false,
            message: message,
            data: [],
          });
        }

        vendor = await sails.helpers.general.getLoggedinUser(
          vendor.id,
          inputs,
          global.ROLE.VENDOR
        );

        return exits.success({
          status: true,
          message: sails.config.strings[inputs.language].LOGGED_IN,
          data: vendor,
        });
      })
      .catch((err) => {
        sails.log(`Error logging in vendor, Error: ${err}`);
        return exits.serverError({
          status: false,
          message: sails.config.strings[inputs.language].UNABLE_TO_LOGIN,
          data: [],
        });
      });
  },
};
