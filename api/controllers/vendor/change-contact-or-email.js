module.exports = {
  friendlyName: "Change contact or email",

  description: "",

  inputs: {
    vendor: {
      type: "ref",
      required: false,
      description: "logged in vendor",
    },
    vendor_id: {
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
    sails.log("action vendor/change-contact-or-email started");
    const strings = sails.config.strings[inputs.vendor.language];
    try {
      let recepient = null;
      let subject = "Verify Email";
      let msg = null;
      let otp = await sails.helpers.generateRandom.with({});
      let rec = {};
      var is_email = _.isString(inputs.vendor_id);
      let where = { id: { "!=": inputs.vendor.id } };
      if (is_email) {
        var vendor_id = inputs.vendor_id.toLowerCase();
        if (vendor_id == inputs.vendor.email) {
          return exits.ok({
            status: false,
            message: strings.EMAIL_IS_SAME,
          });
        }
        recepient = vendor_id;

        where.or = [{ email: vendor_id }, { unverified_email: vendor_id }];
        other_vendor = await Vendor.findOne(where);
        if (other_vendor) {
          return exits.ok({
            status: false,
            message: strings.EMAIL_ALREADY_EXIST,
          });
        }
        rec.verify_email_otp = otp;
        rec.unverified_email = vendor_id;
        msg = strings.VERIFY_EMAIL_MSG.replace("{OTP}", otp);
      } else {
        vendor_id = inputs.vendor_id;
        vendor_id.number = vendor_id.number.replace(/\s/g, "");
        if (
          vendor_id.country_code == inputs.vendor.country_code &&
          vendor_id.number == inputs.vendor.contact
        ) {
          return exits.ok({
            status: false,
            message: strings.CONTACT_IS_SAME,
          });
        }
        where.contact = vendor_id.number;
        where.country_code = vendor_id.country_code;

        where.or = [
          {
            country_code: vendor_id.country_code,
            contact: vendor_id.number.replace(/\s/g, ""),
          },
          {
            unverified_country_code: vendor_id.country_code,
            unverified_contact: vendor_id.number.replace(/\s/g, ""),
          },
        ];
        other_vendor = await Vendor.findOne(where);
        if (other_vendor) {
          return exits.ok({
            status: false,
            message: strings.CONTACT_ALREADY_EXIST,
          });
        }
        recepient = vendor_id.country_code + vendor_id.number;
        rec.unverified_country_code = vendor_id.country_code;
        rec.unverified_contact = vendor_id.number;
        rec.verify_contact_otp = otp;

        subject = "Verify Phone";
        msg = strings.VERIFY_CONTACT_MSG.replace("{OTP}", otp);
      }
      await Vendor.updateOne({ id: inputs.vendor.id }).set(rec);
      await sails.helpers.sendOtp(recepient, otp, msg, is_email, subject);
      sails.log("action vendor/change-contact-or-email ended");
      return exits.success({
        status: true,
        data: {
          otp: otp,
        },
        message: strings.OTP_SENT,
      });
    } catch (err) {
      sails.log(`Error in action vendor/change-contact-or-email. ${err}`);
    }
  },
};
