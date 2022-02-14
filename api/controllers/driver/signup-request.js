const bcrypt = require("bcryptjs");
module.exports = {
  friendlyName: "Signup request driver",

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
    gender: {
      type: "string",
      required: false,
      isIn: ["male", "female", "MALE", "FEMALE"],
    },
    language: {
      type: "string",
      required: false,
      defaultsTo: "en",
      isIn: ["en", "ar", "EN", "AR"],
    },
    location: {
      type: "json",
      required: false,
      custom: function (value) {
        return (
          _.isObject(value) &&
          typeof value.address !== "undefined" &&
          typeof value.lat !== "undefined" &&
          typeof value.lng !== "undefined" &&
          _.isString(value.address) &&
          _.isNumber(value.lat) &&
          _.isNumber(value.lng)
        );
      },
    },
    document: {
      type: "json",
      required: true,
      custom: function (value) {
        return Array.isArray(value);
      },
    },
    country_code: {
      type: "string",
      required: false,
    },
    vehicle_id: {
      type: "number",
      required: false,
    },
    vehicle_name: {
      type: "string",
      required: false,
    },
    number_plate: {
      type: "string",
      required: false,
    },
    referral_code: {
      type: "string",
      required: false,
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
    sails.log("calling action driver/signup-request");
    const strings = sails.config.strings[inputs.language];

    const name = inputs.name;
    const email = inputs.email.toLowerCase();
    const password = inputs.password;
    const contact = inputs.contact.number.replace(/\s/g, "");
    const country_code = inputs.contact.country_code.replace(/\s/g, "");

    driver = await Driver.findOne({ email: email });
    console.log("driver:", driver);
    if (driver) {
      sails.log.warn(
        `Driver with email ${inputs.email} already exists, returning response`
      );
      return exits.success({
        status: false,
        message: strings.EMAIL_ALREADY_EXIST,
        data: [],
      });
    }
    driver = await Driver.findOne({
      contact: contact,
      country_code: country_code,
    });

    if (driver) {
      sails.log.warn(
        `driver with contact ${contact} already exists, returning response`
      );
      return exits.success({
        status: false,
        message: strings.CONTACT_ALREADY_EXIST,
        data: [],
      });
    }
    if (inputs.referral_code) {
      driver = await Driver.findOne({ referral_code: inputs.referral_code });
      if (!driver) {
        return exits.success({
          status: false,
          message: strings.INVALID_REFERRAL_CODE,
          data: [],
        });
      }
    }

    sails.log(`Encrypting driver password`);
    bcrypt
      .hash(password, 12)
      .then(async (hashedPassword) => {
        sails.log(`Password encrypted, now signing driver up`);
        try {
          var unverified_driver = await Unverified_driver.findOne({
            email: email,
          });
          if (!unverified_driver) {
            unverified_driver = await Unverified_driver.findOne({
              contact: contact,
              country_code: country_code,
            });
          }
          var random = await sails.helpers.generateRandom.with({});
          const rec = {
            name: name,
            email: email,
            password: hashedPassword,
            country_code: country_code,
            contact: contact,
            otp: random,
          };
          if (inputs.language) {
            rec.language = inputs.language;
          }
          if (inputs.location) {
            rec.address = inputs.location.address;
            rec.lat = inputs.location.lat;
            rec.lng = inputs.location.lng;
          }
          if (inputs.gender) {
            rec.gender = inputs.gender.toLowerCase();
          }
          if (inputs.country_code) {
            rec.country = inputs.country_code;
          }
          if (inputs.vehicle_id) {
            rec.vehicle_id = inputs.vehicle_id;
          }
          if (inputs.vehicle_name) {
            rec.vehicle_name = inputs.vehicle_name;
          }
          if (inputs.number_plate) {
            rec.number_plate = inputs.number_plate;
          }
          if (inputs.referral_code) {
            rec.referral_code = inputs.referral_code;
          }
          if (inputs.document) {
            rec.document = JSON.stringify(inputs.document);
          }
          if (unverified_driver) {
            var unverified_driver = await Unverified_driver.updateOne({
              id: unverified_driver.id,
            }).set(rec);
          } else {
            var unverified_driver = await Unverified_driver.create(rec).fetch();
          }

          if (unverified_driver.id) {
            sails.log(`Driver signed up with email '${inputs.email}'`);
            delete unverified_driver.password;
            let message = `Waspha Verification OTP is : ${unverified_driver.otp} `;
            translation = await Waspha_translation_all.find({
              key: "REGISTRATION_OTP_MESSAGE",
            }).limit(1);
            if (translation.length) {
              message = translation[0][inputs.language].replace(
                "{otp}",
                unverified_driver.otp
              );
            }
            sails.helpers.sendSms(
              unverified_driver.country_code + unverified_driver.contact,
              message
            );
            sails.helpers.mail.send(
              unverified_driver.email,
              "Signup Request",
              message
            );
            return exits.success({
              status: true,
              message: strings.SIGNUP_REQUEST_SUBMITTED,
              data: { otp: unverified_driver.otp },
            });
          }
        } catch (err) {
          sails.log.error(`Exception occured: ${err}`);
          return exits.serverError(err);
          // …
        }
      })
      .catch((err) => {
        return exits.serverError(err);
      });
  },
};
