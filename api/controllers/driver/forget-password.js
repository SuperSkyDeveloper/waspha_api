module.exports = {
  friendlyName: "Forget password",

  description: "Forget password driver",

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
    sails.log("calling action driver/forget-password");
    const strings = sails.config.strings[inputs.language];
    var is_email = _.isString(inputs.user_id);
    let driver = null;

    if (is_email) {
      var user_id = inputs.user_id.toLowerCase();

      driver = await Driver.findOne({ email: user_id });
      sails.log(user_id);
      var message = strings.CODE_SENT_TO_EMAIL_USER;
    } else {
      driver = await Driver.findOne({
        contact: inputs.user_id.number.replace(/\s/g, ""),
        country_code: inputs.user_id.country_code,
      });
      message = strings.CODE_SENT_TO_PHONE_USER;
    }

    sails.log({ is_email: is_email, inputs, driver: driver });
    var random = await sails.helpers.generateRandom.with({});

    if (driver) {
      sails.log(
        `Driver with user_id '${inputs.user_id}' found, now will process request further`
      );
      var updatedDriver = await Driver.updateOne({ id: driver.id }).set({
        otp: random,
      });
      otp = updatedDriver.otp;
      let msg = strings.FORGET_PASSWORD_EMAIL_MSG.replace("{OTP}", otp);
      if (is_email) {
        recepient = updatedDriver.email;
      } else {
        recepient = updatedDriver.country_code + updatedDriver.contact;
        msg = strings.FORGET_PASSWORD_PHONE_MSG.replace("{OTP}", otp);
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
        strings.FORGET_PASSWORD
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
      message: strings.INVALID_USER_ID,
      data: [],
    });
  },
};
