module.exports = {
  friendlyName: "Forget password",

  description: "",

  inputs: {
    user_id: {
      type: "json",
      required: true,
      custom: function (value) {
        return (
          (_.isObject(value) &&
            !_.isUndefined(value.country_code) &&
            //  !_.isUndefined(value.phone_number) &&
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
    sails.log("calling action user/forget-password");
    const strings = sails.config.strings[inputs.language];
    var is_email = _.isString(inputs.user_id);
    if (is_email) {
      var user_id = inputs.user_id.toLowerCase();

      user = await User.findOne({ email: user_id });
      var message = strings.CODE_SENT_TO_EMAIL_USER;
    } else {
      user = await User.findOne({
        contact: inputs.user_id.number.replace(/\s/g, ""),
        country_code: inputs.user_id.country_code,
      });
      message = strings.CODE_SENT_TO_PHONE_USER;
    }

    var random = await sails.helpers.generateRandom.with({});

    if (user) {
      sails.log(
        `User with user_id '${inputs.user_id}' found, now will process request further`
      );
      var updatedUser = await User.updateOne({ id: user.id }).set({
        otp: random,
      });
      otp = updatedUser.otp;

      let msg = strings.FORGET_PASSWORD_EMAIL_MSG.replace("{OTP}", otp);
      if (is_email) {
        recepient = updatedUser.email;
      } else {
        recepient = updatedUser.country_code + updatedUser.contact;
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
        message: strings.CODE_SENT_IF_YOU_ARE_REGISTERED_USER,
      });
    }
    return exits.ok({
      status: false,
      message: strings.INVALID_USER_ID,
      data: [],
    });
  },
};
