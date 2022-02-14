module.exports = {
  friendlyName: "Change contact or email",

  description: "",

  inputs: {
    driver: {
      type: "ref",
      required: false,
      description: "logged in driver",
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
    otp: {
      type: "number",
      required: true,
    },
  },

  exits: {
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("action driver/verify-contact-or-email started");
    const strings = sails.config.strings[inputs.driver.language];
    try {
      let user_id = inputs.user_id;
      let otp = inputs.otp;
      let recepient = null;
      let message = null;
      let rec = {};
      let is_email = _.isString(user_id);
      let where = { id: inputs.driver.id };
      if (is_email) {
        user_id = user_id.toLowerCase();

        where.unverified_email = user_id;
        where.verify_email_otp = otp;
        found = await Driver.findOne(where);
        if (!found) {
          return exits.ok({
            status: false,
            message: strings.INVALID_EMAIL_OR_OTP,
          });
        }
        rec.email = user_id;
        rec.unverified_email = null;
        rec.verify_email_otp = null;
        rec.is_email_verified = true;
        message = strings.EMAIL_VERIFIED;
      } else {
        user_id.number = user_id.number.replace(/\s/g, "");
        where.unverified_contact = user_id.number;
        where.unverified_country_code = user_id.country_code;
        where.verify_contact_otp = otp;

        found = await Driver.findOne(where);
        if (!found) {
          return exits.ok({
            status: false,
            message: strings.INVALID_CONTACT_OR_OTP,
          });
        }
        recepient = user_id.country_code + user_id.number;
        rec.country_code = user_id.country_code;
        rec.contact = user_id.number;
        rec.is_contact_verified = true;
        rec.unverified_country_code = null;
        rec.unverified_contact = null;
        rec.verify_contact_otp = null;

        message = strings.CONTACT_VERIFIED;
      }
      driver = await Driver.updateOne({ id: inputs.driver.id }).set(rec);

      await sails.helpers.general.attachCountry(
        driver.id,
        driver.country_code,
        global.ROLE.DRIVER
      );
      driver = await sails.helpers.general.getLoggedinUser(
        driver.id,
        inputs,
        global.ROLE.DRIVER
      );
      sails.log("action driver/verify-contact-or-email ended");
      return exits.success({
        status: true,
        message: message,
        data: driver,
      });
    } catch (err) {
      sails.log(`Error in action driver/verify-contact-or-email. ${err}`);
    }
  },
};
