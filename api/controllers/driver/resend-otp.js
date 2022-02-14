module.exports = {
  friendlyName: "Resend otp",

  description: "Resend otp driver",

  inputs: {
    user_id: {
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
    sails.log("calling action driver/resend-otp");
    const strings = sails.config.strings[inputs.language];

    var is_email = _.isString(inputs.user_id);
    if (is_email) {
      var user_id = inputs.user_id.toLowerCase();
      driver = await Unverified_driver.findOne({ email: user_id });
    } else {
      driver = await Unverified_driver.findOne({
        contact: inputs.user_id.number.replace(/\s/g, ""),
        country_code: inputs.user_id.country_code,
      });
    }

    if (!driver) {
      sails.log.warn(
        `Unverified driver with email or contact '${user_id}' not exists, returning response`
      );
      return exits.ok({
        status: false,
        message: strings.INVALID_USER_ID,
        data: [],
      });
    }
    var random = await sails.helpers.generateRandom.with({});
    if (random) {
      var updateddriver = await Unverified_driver.updateOne({
        id: driver.id,
      }).set({
        otp: random,
      });
      let message = `Waspha Verification OTP is : ${updateddriver.otp} `;
      translation = await Waspha_translation_all.find({
        key: "REGISTRATION_OTP_MESSAGE",
      }).limit(1);
      if (translation.length) {
        message = translation[0][inputs.language].replace(
          "{otp}",
          updateddriver.otp
        );
      }
      sails.helpers.sendSms(
        updateddriver.country_code + updateddriver.contact,
        message
      );
    }

    return exits.success({
      status: true,
      message: strings.OTP_SENT,
      data: {
        otp: updateddriver.otp,
      },
    });
  },
};
