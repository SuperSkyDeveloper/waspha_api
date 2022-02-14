const bcrypt = require("bcryptjs");
module.exports = {
  friendlyName: "Login",

  description: "Login driver.",

  inputs: {
    driver_id: {
      type: "string",
      required: true,
    },
    password: {
      type: "string",
      required: true,
    },
    location: {
      type: "json",
      required: false,
      custom: function (value) {
        return (
          _.isObject(value) &&
          //&& typeof value.address !== 'undefined'
          typeof value.lat !== "undefined" &&
          typeof value.lng !== "undefined" &&
          // && _.isString(value.address)
          _.isNumber(value.lat) &&
          _.isNumber(value.lng)
        );
      },
    },
    language: {
      type: "string",
      required: false,
      allowNull: true,
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
    sails.log("calling action driver/login");
    let language = inputs.language;
    var driver_id = inputs.driver_id.toLowerCase();
    driver_id = driver_id.replace(/\s/g, "");
    const password = inputs.password;
    let driver = await Driver.findOne({ email: driver_id });
    let message = sails.config.strings[language].INVALID_USER_ID_OR_PASSWORD;
    if (!driver) {
      driver = await Driver.findOne({ contact: driver_id.replace(/^0+/, "") });
    }

    if (!driver) {
      sails.log.warn(`driver has entered the invalid id`);
      return exits.ok({
        status: false,
        message: message,
        data: [],
      });
    }
    if (!driver.password) {
      sails.log.warn(`driver does not have password`);
      return exits.ok({
        status: false,
        message: message,
        data: [],
      });
    }

    bcrypt
      .compare(password.toString(), driver.password)
      .then(async (isEqual) => {
        console.log("isEqual: ", isEqual);
        if (!isEqual) {
          sails.log.warn(
            `driver_id ${driver.id} has entered the wrong password`
          );

          return exits.ok({
            status: false,
            message: message,
            data: [],
          });
        }
        driver = await sails.helpers.general.getLoggedinUser(
          driver.id,
          inputs,
          global.ROLE.DRIVER
        );

        return exits.success({
          status: true,
          message: sails.config.strings[language].LOGGED_IN,
          data: driver,
        });
      })
      .catch((err) => {
        sails.log(`Error logging in driver, Error: ${err}`);
        return exits.serverError({
          status: false,
          message: sails.config.strings[language].UNABLE_TO_LOGIN,
          data: [],
        });
      });
  },
};
