const bcrypt = require("bcryptjs");
module.exports = {
  friendlyName: "Reset password vendor",

  description: "",

  inputs: {
    vendor_id: {
      type: "json",
      required: true,
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
  },

  fn: async function (inputs, exits) {
    sails.log("calling action vendor/reset-password");
    const strings = sails.config.strings[inputs.language];
    var is_email = _.isString(inputs.vendor_id);
    if (is_email) {
      var vendor_id = inputs.vendor_id.toLowerCase();
      vendor = await Vendor.findOne({ email: vendor_id, otp: inputs.otp });
    } else {
      contact = inputs.vendor_id.number.replace(/\s/g, "");
      vendor = await Vendor.findOne({
        contact: contact,
        country_code: inputs.vendor_id.country_code,
        otp: inputs.otp,
      });
    }

    if (!vendor) {
      sails.log.warn(
        `vendor with email or contact '${inputs.vendor_id}' not exists, returning response`
      );
      return exits.ok({
        status: false,
        message: strings.INVALID_VENDOR_ID,
        data: [],
      });
    }
    let id = vendor.id;
    let password = inputs.password;

    ////////////
    sails.log("checking if vendor is trying to set old password");
    bcrypt.compare(password.toString(), vendor.password, function (err, res) {
      if (err) {
        console.log("err:", err);
      }
      if (res === true) {
        sails.log.warn(`vendor_id ${vendor.id} has entered the wrong password`);
        return exits.ok({
          status: false,
          message: strings.YOU_ENTERED_OLD_PASSWORD,
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

            console.log("new vendor:", vendor);
            if (vendor.id) {
              sails.log(`vendor password has been reset`);
              delete vendor.password;

              return exits.success({
                status: true,
                message: strings.PASSWORD_RESET,
                data: vendor,
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
    // .catch(err => {
    //     if(!err.statusCode){
    //         err.statusCode = 500;
    //     }

    // })
  },
};
