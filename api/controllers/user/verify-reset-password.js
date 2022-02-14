module.exports = {
  friendlyName: "Verify reset password",

  description: "",

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
    otp: {
      type: "number",
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
    sails.log("calling action user/verify-reset-password");
    const strings = sails.config.strings[inputs.language];
    var is_email = _.isString(inputs.user_id);
    if (is_email) {
      var user_id = inputs.user_id.toLowerCase();

      user = await User.findOne({ email: user_id, otp: inputs.otp });
      var message = strings.CODE_SENT_TO_EMAIL_USER;
    } else {
      user = await User.findOne({
        contact: inputs.user_id.number.replace(/\s/g, ""),
        country_code: inputs.user_id.country_code,
        otp: inputs.otp,
      });
      message = strings.CODE_SENT_TO_PHONE_USER;
    }

    if (!user) {
      sails.log.warn(
        `user with email or contact '${inputs.user_id}' and otp '${inputs.otp}' not exists, returning response`
      );
      return exits.ok({
        status: false,
        message: strings.INVALID_USER_ID_OR_OTP,
        data: [],
      });
    }
    return exits.success({
      status: true,
      message: strings.YOU_CAN_RESET_PASSWORD_NOW,
      data: [],
    });
  },
};
