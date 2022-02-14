module.exports = {
  friendlyName: "Resend otp user",

  description: "",

  inputs: {
    user_id: {
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
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action user/resend-otp");
    const strings = sails.config.strings[inputs.language];
    var user_id = inputs.user_id.toLowerCase();
    user_id = user_id.replace(/\s/g, "");
    user = await Unverified_user.findOne({ email: user_id });
    let is_email = true;
    if (!user) {
      user = await Unverified_user.findOne({ contact: user_id });
      is_email = false;
    }

    if (!user) {
      sails.log.warn(
        `Unverified user with email or contact '${user_id}' not exists, returning response`
      );
      return exits.ok({
        status: false,
        message: strings.INVALID_USER_ID,
        data: [],
      });
    }
    var random = await sails.helpers.generateRandom.with({});
    if (random) {
      var updatedUser = await Unverified_user.updateOne({ id: user.id }).set({
        otp: random,
      });
      let otp = random;

      let msg = strings.RESEND_OTP_EMAIL_MSG.replace("{OTP}", otp);
      if (is_email) {
        recepient = updatedUser.email;
      } else {
        recepient = updatedUser.country_code + updatedUser.contact;
        msg = strings.RESEND_OTP_PHONE_MSG.replace("{OTP}", otp);
      }
      translation = await Waspha_translation_all.find({
        key: "REGISTRATION_OTP_MESSAGE",
      }).limit(1);
      if (translation.length) {
        msg = translation[0][inputs.language].replace("{otp}", otp);
      }
      await sails.helpers.sendOtp(recepient, otp, msg, is_email, "Resend OTP");
    }

    return exits.success({
      status: true,
      message: strings.OTP_SENT,
      data: {
        otp: updatedUser.otp,
      },
    });
  },
};
