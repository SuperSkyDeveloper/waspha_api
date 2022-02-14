const bcrypt = require("bcryptjs");

module.exports = {
  friendlyName: "Signup",

  description: "Signup vendor.",

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
    sails.log("calling action vendor/signup");
    const strings = sails.config.strings[inputs.language];
    // vendor = await Unverified_vendor.findOne({email: inputs.email, otp: inputs.otp});

    var is_email = _.isString(inputs.vendor_id);
    if (is_email) {
      var vendor_id = inputs.vendor_id.toLowerCase();
      vendor = await Unverified_vendor.findOne({
        email: vendor_id,
        otp: inputs.otp,
      });
    } else {
      vendor = await Unverified_vendor.findOne({
        contact: inputs.vendor_id.number.replace(/\s/g, ""),
        country_code: inputs.vendor_id.country_code,
        otp: inputs.otp,
      });
    }
    console.log("unverified vendor:", vendor);
    if (!vendor) {
      sails.log.warn(
        `Unverified vendor with vendor id '${inputs.vendor_id}' and otp '${inputs.otp}' not exists, returning response`
      );
      return exits.ok({
        status: false,
        data: [],
        message: strings.INVALID_VENDOR_ID_OR_OTP,
      });
    }

    const name = vendor.name;
    const email = vendor.email;
    const password = vendor.password;
    const contact = vendor.contact;
    const country_code = vendor.country_code;
    const role_id = vendor.role_id;
    //const country = vendor.country;

    const referral_code = await sails.helpers.general.getReferralCode(
      global.ROLE.VENDOR
    );
    if (vendor.referral_code) {
      let where = {};
      where["referral_code"] = vendor.referral_code;
      found = await Vendor.findOne({ where: where });
      let setting = await sails.helpers.getSetting("waspha_referral_points");
      await sails.helpers.general.updateLoyaltyPoints(
        found.id,
        global.ROLE.VENDOR,
        setting[0].value
      );
      var referred_by = vendor.referral_code;
    }

    sails.log(`Encrypting vendor password`);

    sails.log(`Password encrypted, now signing vendor up`);
    try {
      let rec = {
        name: name,
        email: email,
        password: password,
        contact: contact,
        country_code: country_code,
        referral_code: referral_code,
        is_contact_verified: true,
        is_email_verified: false,
      };
      if (referred_by) {
        rec.referred_by = referred_by;
      }
      var loadedVendor = await Vendor.create(rec).fetch();

      if (loadedVendor.id) {
        await Unverified_vendor.destroyOne({
          email: inputs.email,
          otp: inputs.otp,
        });
        sails.log(`vendor signed up with email '${inputs.email}'`);
        loadedVendor["is_approved"] = loadedVendor.status == 1 ? true : false;

        vendor = await sails.helpers.general.getLoggedinUser(
          loadedVendor.id,
          inputs,
          global.ROLE.VENDOR
        );

        vendor.is_form_submitted = false;
        return exits.success({
          status: true,
          data: vendor,
          message: strings.SIGNED_UP,
        });
      }
      return exits.ok({
        status: false,
        message: strings.UNABLE_TO_SIGNUP,
        data: [],
      });
    } catch (err) {
      sails.log.error(`Error in signup process, Error: ${err}`);
      return exits.serverError({
        status: false,
        message: strings.UNABLE_TO_SIGNUP,
        data: [],
      });
    }
  },
};
