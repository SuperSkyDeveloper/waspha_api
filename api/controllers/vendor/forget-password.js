module.exports = {
  friendlyName: "Forget password",

  description: "",

  inputs: {
    vendor_id: {
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
    language: {
      type: "string",
      required: false,
      isIn: ["en", "ar", "EN", "AR"],
      defaultsTo: "en",
    },
  },

  exits: {
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
    sails.log("calling action vendor/forget-password");

    var is_email = _.isString(inputs.vendor_id);
    if (is_email) {
      var vendor_id = inputs.vendor_id.toLowerCase();

      vendor = await Vendor.findOne({ email: vendor_id });
      var message =
        sails.config.strings[inputs.language].CODE_SENT_TO_EMAIL_VENDOR;
    } else {
      vendor = await Vendor.findOne({
        contact: inputs.vendor_id.number.replace(/\s/g, ""),
        country_code: inputs.vendor_id.country_code,
      });
      message = sails.config.strings[inputs.language].CODE_SENT_TO_PHONE_VENDOR;
    }

    var random = await sails.helpers.generateRandom.with({});

    if (vendor) {
      sails.log(
        `vendor with email '${inputs.email}' found, now email will be sent to reset password`
      );
      var updatedvendor = await Vendor.updateOne({ id: vendor.id }).set({
        otp: random,
      });
      otp = updatedvendor.otp;
      let msg = sails.config.strings[
        inputs.language
      ].FORGET_PASSWORD_EMAIL_MSG.replace("{OTP}", otp);
      if (is_email) {
        recepient = updatedvendor.email;
      } else {
        recepient = updatedvendor.country_code + updatedvendor.contact;
        msg = sails.config.strings[
          inputs.language
        ].FORGET_PASSWORD_PHONE_MSG.replace("{OTP}", otp);
      }
      translation = await Waspha_translation_all.find({
        key: "FORGET_PASSWORD_OTP_MESSAGE",
      }).limit(1);
      if (translation.length) {
        msg = translation[0][inputs.language].replace("{otp}", otp);
      }
      await sails.helpers.sendOtp(
        recepient,
        otp,
        msg,
        is_email,
        sails.config.strings[inputs.language].FORGET_PASSWORD
      );

      return exits.success({
        status: true,
        data: {
          otp: otp,
        },
        message: message,
      });
    }
    return exits.ok({
      status: false,
      message: sails.config.strings[inputs.language].INVALID_VENDOR_ID,
    });
  },
};
