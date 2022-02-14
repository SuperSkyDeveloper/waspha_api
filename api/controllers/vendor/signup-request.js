const bcrypt = require("bcryptjs");
module.exports = {
  friendlyName: "Signup request vendor",

  description: "",

  inputs: {
    name: {
      type: "string",
      required: true,
    },
    email: {
      type: "string",
      required: true,
    },
    contact: {
      type: "json",
      required: true,
      custom: function (value) {
        return (
          _.isObject(value) &&
          !_.isUndefined(value.country_code) &&
          !_.isUndefined(value.phone_number) &&
          !_.isUndefined(value.number)
        );
      },
    },
    password: {
      type: "string",
      required: true,
    },
    country_code: {
      type: "string",
      required: false,
    },
    referral_code: {
      type: "string",
      required: false,
    },
    language: {
      type: "string",
      required: false,
      defaultsTo: "en",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    sails.log("calling action vendor/signup-request");
    const strings = sails.config.strings[inputs.language];
    const name = inputs.name;
    const email = inputs.email.toLowerCase();
    const password = inputs.password;
    const contact = inputs.contact.number.replace(/\s/g, "");
    const country_code = inputs.contact.country_code.replace(/\s/g, "");
    vendor = await Vendor.findOne({ email: email });

    if (vendor) {
      sails.log.warn(
        `vendor with email ${inputs.email} already exists, returning response`
      );
      return exits.success({
        status: false,
        data: [],
        message: strings.EMAIL_ALREADY_EXIST,
      });
    }

    vendor = await Vendor.findOne({
      contact: contact,
      country_code: country_code,
    });
    console.log("vendor:", vendor);
    if (vendor) {
      sails.log.warn(
        `vendor with contact ${contact} already exists, returning response`
      );
      return exits.success({
        status: false,
        message: strings.CONTACT_ALREADY_EXIST,
        data: [],
      });
    }

    if (inputs.referral_code) {
      vendor = await Vendor.findOne({ referral_code: inputs.referral_code });
      if (!vendor) {
        return exits.success({
          status: false,
          message: strings.INVALID_REFERRAL_CODE,
          data: [],
        });
      }
    }

    sails.log(`Encrypting vendor password`);
    bcrypt
      .hash(password, 12)
      .then(async (hashedPassword) => {
        sails.log(`Password encrypted, now signing vendor up`);
        try {
          var unverified_vendor = await Unverified_vendor.findOne({
            email: email,
          });
          var random = await sails.helpers.generateRandom.with({});
          let rec = {
            name: name,
            email: email,
            password: hashedPassword,
            contact: contact,
            country_code: country_code,
            otp: random,
            // country: inputs.country_code || null,
          };
          if (inputs.referral_code) {
            rec.referral_code = inputs.referral_code;
          }
          if (unverified_vendor) {
            var unverified_vendor = await Unverified_vendor.updateOne({
              email: email,
            }).set(rec);
          } else {
            var unverified_vendor = await Unverified_vendor.create(rec).fetch();
          }

          if (unverified_vendor.id) {
            sails.log(`vendor signed up with email '${inputs.email}'`);
            delete unverified_vendor.password;
            let message = `Waspha Verification OTP is : ${unverified_vendor.otp} `;
            translation = await Waspha_translation_all.find({
              key: "REGISTRATION_OTP_MESSAGE",
            }).limit(1);
            if (translation.length) {
              message = translation[0][inputs.language].replace(
                "{otp}",
                unverified_vendor.otp
              );
            }
            sails.helpers.sendSms(
              unverified_vendor.country_code + unverified_vendor.contact,
              message
            );
            sails.helpers.mail.send(
              unverified_vendor.email,
              "Signup Request",
              message
            );
            return exits.success({
              status: true,
              data: {
                otp: unverified_vendor.otp,
              },
              message: strings.SIGNUP_REQUEST_SUBMITTED,
            });
          }
        } catch (err) {
          sails.log.error(`Error processiong signup request, Error: ${err}`);
          return exits.serverError({
            status: false,
            message: strings.UNABLE_TO_SIGNUP,
            data: [],
          });
        }
      })
      .catch((err) => {
        sails.log.error(`Error processiong signup request, Error: ${err}`);
        return exits.serverError({
          status: false,
          message: strings.UNABLE_TO_SIGNUP,
          data: [],
        });
      });
  },
};
