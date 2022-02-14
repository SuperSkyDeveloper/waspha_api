const bcrypt = require("bcryptjs");
module.exports = {
  friendlyName: "Signup request",

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
      isIn: ["en", "ar"],
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
    sails.log("calling action user/signup-request");
    const strings = sails.config.strings[inputs.language];
    const name = inputs.name;
    const email = inputs.email.toLowerCase();
    const password = inputs.password;
    const contact = inputs.contact.number.replace(/\s/g, "");
    const country_code = inputs.contact.country_code.replace(/\s/g, "");

    $user = await User.findOne({ email: email });
    console.log("user:", $user);

    if ($user) {
      sails.log.warn(
        `User with email ${inputs.email} already exists, returning response`
      );
      return exits.success({
        status: false,
        message: strings.EMAIL_ALREADY_EXIST,
        data: [],
      });
    }
    user = await User.findOne({ contact: contact, country_code: country_code });

    if (user) {
      sails.log.warn(
        `user with contact ${contact} already exists, returning response`
      );
      return exits.success({
        status: false,
        message: strings.CONTACT_ALREADY_EXIST,
        data: [],
      });
    }
    if (inputs.referral_code) {
      user = await User.findOne({ referral_code: inputs.referral_code });
      if (!user) {
        return exits.success({
          status: false,
          message: strings.INVALID_REFERRAL_CODE,
          data: [],
        });
      }
    }

    sails.log(`Encrypting user password`);
    bcrypt
      .hash(password, 12)
      .then(async (hashedPassword) => {
        sails.log(`Password encrypted, now signing user up`);
        try {
          var unverified_user = await Unverified_user.findOne({ email: email });
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
          // if (inputs.country_code) {
          //   rec.country = inputs.country_code;
          // }
          if (inputs.referral_code) {
            rec.referral_code = inputs.referral_code;
          }
          if (unverified_user) {
            var unverified_user = await Unverified_user.updateOne({
              email: email,
            }).set(rec);
          } else {
            var unverified_user = await Unverified_user.create(rec).fetch();
          }

          if (unverified_user.id) {
            sails.log(`User signed up with email '${inputs.email}'`);
            delete unverified_user.password;
            let message = `Waspha Verification OTP is : ${unverified_user.otp} `;
            translation = await Waspha_translation_all.find({
              key: "REGISTRATION_OTP_MESSAGE",
            }).limit(1);
            if (translation.length) {
              message = translation[0][inputs.language].replace(
                "{otp}",
                unverified_user.otp
              );
            }
            sails.helpers.sendSms(
              unverified_user.country_code + unverified_user.contact,
              message
            );
            sails.helpers.mail.send(
              unverified_user.email,
              "Signup Request",
              message
            );
            return exits.success({
              status: true,
              message: strings.SIGNUP_REQUEST_SUBMITTED,
              data: unverified_user,
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
