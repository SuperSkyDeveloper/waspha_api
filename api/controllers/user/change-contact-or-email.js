module.exports = {
  friendlyName: "Change contact or email",

  description: "",

  inputs: {
    user: {
      type: "ref",
      required: false,
      description: "logged in user",
    },
    user_id: {
      type: "json",
      required: true,
      custom: function (value) {
        return (
          (_.isObject(value) &&
            !_.isUndefined(value.country_code) &&
            //!_.isUndefined(value.phone_number) &&
            !_.isUndefined(value.number)) ||
          _.isString(value)
        );
      },
    },
  },

  exits: {
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("action user/change-contact-or-email started");
    const strings = sails.config.strings[inputs.user.language];
    try {
      let recepient = null;
      let subject = "Verify Email";
      let msg = null;
      let otp = await sails.helpers.generateRandom.with({});
      let rec = {};
      var is_email = _.isString(inputs.user_id);
      let where = { id: { "!=": inputs.user.id } };
      if (is_email) {
        var user_id = inputs.user_id.toLowerCase();
        if (user_id == inputs.user.email) {
          return exits.ok({
            status: false,
            message: strings.EMAIL_IS_SAME,
          });
        }
        recepient = user_id;

        where.or = [{ email: user_id }, { unverified_email: user_id }];
        other_user = await User.findOne(where);
        if (other_user) {
          return exits.ok({
            status: false,
            message: strings.EMAIL_ALREADY_EXIST,
          });
        }
        rec.verify_email_otp = otp;
        rec.unverified_email = user_id;
        msg = strings.VERIFY_EMAIL_MSG.replace("{OTP}", otp);
      } else {
        user_id = inputs.user_id;
        user_id.number = user_id.number.replace(/\s/g, "");
        if (
          user_id.country_code == inputs.user.country_code &&
          user_id.number == inputs.user.contact
        ) {
          return exits.ok({
            status: false,
            message: strings.CONTACT_IS_SAME,
          });
        }
        where.contact = user_id.number;
        where.country_code = user_id.country_code;

        where.or = [
          {
            country_code: user_id.country_code,
            contact: user_id.number.replace(/\s/g, ""),
          },
          {
            unverified_country_code: user_id.country_code,
            unverified_contact: user_id.number.replace(/\s/g, ""),
          },
        ];
        other_user = await User.findOne(where);
        if (other_user) {
          return exits.ok({
            status: false,
            message: strings.CONTACT_ALREADY_EXIST,
          });
        }
        recepient = user_id.country_code + user_id.number;
        rec.unverified_country_code = user_id.country_code;
        rec.unverified_contact = user_id.number;
        rec.verify_contact_otp = otp;

        subject = "Verify Phone";
        msg = strings.VERIFY_CONTACT_MSG.replace("{OTP}", otp);
      }
      await User.updateOne({ id: inputs.user.id }).set(rec);
      await sails.helpers.sendOtp(recepient, otp, msg, is_email, subject);
      sails.log("action user/change-contact-or-email ended");
      return exits.success({
        status: true,
        data: {
          otp: otp,
        },
        message: strings.OTP_SENT,
      });
    } catch (err) {
      sails.log(`Error in action user/change-contact-or-email. ${err}`);
    }
  },
};
