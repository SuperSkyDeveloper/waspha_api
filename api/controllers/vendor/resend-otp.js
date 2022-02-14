module.exports = {
  friendlyName: "Resend otp vendor",

  description: "",

  inputs: {
    vendor_id: {
      type: "json",
      required: true,
      custom: function (value) {
        return (
          (_.isObject(value) &&
            !_.isUndefined(value.country_code) &&
            //&& !_.isUndefined(value.phone_number)
            !_.isUndefined(value.number)) ||
          _.isString(value)
        );
      },
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
  },

  fn: async function (inputs, exits) {
    sails.log("calling action vendor/resend-otp");
    const strings = sails.config.strings[inputs.language];

    var is_email = _.isString(inputs.vendor_id);
    if (is_email) {
      var vendor_id = inputs.vendor_id.toLowerCase();
      vendor = await Unverified_vendor.findOne({ email: vendor_id });
    } else {
      vendor = await Unverified_vendor.findOne({
        contact: inputs.vendor_id.number.replace(/\s/g, ""),
        country_code: inputs.vendor_id.country_code,
      });
    }
    ///
    console.log("unverified vendor:", vendor);
    if (!vendor) {
      sails.log.warn(
        `Unverified vendor with email or contact '${vendor_id}' not exists, returning response`
      );
      return exits.ok({
        status: false,
        message: strings.INVALID_VENDOR_ID,
        data: [],
      });
    }
    var random = await sails.helpers.generateRandom.with({});
    if (random) {
      var updatedvendor = await Unverified_vendor.updateOne({
        id: vendor.id,
      }).set({
        otp: random,
      });

      let otp = random;
      let msg = strings.RESEND_OTP_EMAIL_MSG.replace("{OTP}", otp);
      translation = await Waspha_translation_all.find({
        key: "REGISTRATION_OTP_MESSAGE",
      }).limit(1);
      if (translation.length) {
        message = translation[0][inputs.language].replace("{otp}", otp);
      }
      if (is_email) {
        recepient = updatedvendor.email;
      } else {
        recepient = updatedvendor.country_code + updatedvendor.contact;
        msg = strings.RESEND_OTP_PHONE_MSG.replace("{OTP}", otp);
      }
      await sails.helpers.sendOtp(recepient, otp, msg, is_email, "Resend OTP");
    }

    return exits.success({
      status: true,
      message: strings.OTP_SENT,
      data: {
        otp: updatedvendor.otp,
      },
    });
  },
};
