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
    sails.log("action vendor/verify-contact-or-email started");
    const strings = sails.config.strings[inputs.vendor.language];
    try {
      let vendor_id = inputs.vendor_id;
      let otp = inputs.otp;
      let recepient = null;
      let message = null;
      let rec = {};
      let is_email = _.isString(vendor_id);
      let where = { id: inputs.vendor.id };
      if (is_email) {
        vendor_id = vendor_id.toLowerCase();

        where.unverified_email = vendor_id;
        where.verify_email_otp = otp;
        found = await Vendor.findOne(where);
        if (!found) {
          return exits.ok({
            status: false,
            message: strings.INVALID_EMAIL_OR_OTP,
          });
        }
        rec.email = vendor_id;
        rec.unverified_email = null;
        rec.verify_email_otp = null;
        rec.is_email_verified = true;
        message = strings.EMAIL_VERIFIED;
      } else {
        vendor_id.number = vendor_id.number.replace(/\s/g, "");
        where.unverified_contact = vendor_id.number;
        where.unverified_country_code = vendor_id.country_code;
        where.verify_contact_otp = otp;

        found = await Vendor.findOne(where);
        if (!found) {
          return exits.ok({
            status: false,
            message: strings.INVALID_CONTACT_OR_OTP,
          });
        }
        recepient = vendor_id.country_code + vendor_id.number;
        rec.country_code = vendor_id.country_code;
        rec.contact = vendor_id.number;
        rec.is_contact_verified = true;
        rec.unverified_country_code = null;
        rec.unverified_contact = null;
        rec.verify_contact_otp = null;

        message = strings.CONTACT_VERIFIED;
      }
      vendor = await Vendor.updateOne({ id: inputs.vendor.id }).set(rec);

      await sails.helpers.general.attachCountry(
        vendor.id,
        vendor.country_code,
        global.ROLE.VENDOR
      );
      vendor = await sails.helpers.general.getLoggedinUser(
        vendor.id,
        inputs,
        global.ROLE.VENDOR
      );

      sails.log("action vendor/verify-contact-or-email ended");
      return exits.success({
        status: true,
        message: message,
        data: vendor,
      });
    } catch (err) {
      sails.log(`Error in action vendor/verify-contact-or-email. ${err}`);
    }
  },
};
