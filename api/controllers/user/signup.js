const bcrypt = require("bcryptjs");

module.exports = {
  friendlyName: "Signup",

  description: "Signup user.",

  inputs: {
    email: {
      type: "string",
      required: true,
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
    sails.log("calling action user/signup");
    const strings = sails.config.strings[inputs.language];
    user = await Unverified_user.findOne({
      email: inputs.email,
      otp: inputs.otp,
    });

    if (!user) {
      sails.log.warn(
        `Unverified User with email '${inputs.email}' and otp '${inputs.otp}' not exists, returning response`
      );
      return exits.ok({
        status: false,
        message: strings.INVALID_OTP,
        data: [],
      });
    }

    const name = user.name;
    const email = user.email;
    const password = user.password;
    const country_code = user.country_code;
    const contact = user.contact;
    const language = user.language;
    const country = user.country;
    const loyalty_points = await sails.helpers.getNewUserLoyaltyPoints();
    const referral_code = await sails.helpers.general.getReferralCode(
      global.ROLE.USER
    );
    if (user.referral_code) {
      let where = {};
      where["referral_code"] = user.referral_code;
      found = await User.findOne({ where: where });
      let setting = await sails.helpers.getSetting("waspha_referral_points");
      await sails.helpers.general.updateLoyaltyPoints(
        found.id,
        global.ROLE.USER,
        setting[0].value
      );
      var referred_by = user.referral_code;
    }
    //getNewUserLoayaltyPoints
    sails.log(`Encrypting user password`);

    sails.log(`Password encrypted, now signing user up`);
    try {
      let rec = {
        name: name,
        email: email,
        password: password,
        country_code: country_code,
        contact: contact,
        language: language,
        loyalty_points: loyalty_points,
        referral_code: referral_code,
        is_contact_verified: true,
        is_email_verified: false,
      };
      if (referred_by) {
        rec.referred_by = referred_by;
      }
      var loadedUser = await User.create(rec).fetch();

      if (loadedUser.id) {
        sails.log(`User signed up with email '${inputs.email}'`);

        await Unverified_user.destroyOne({ email: email, otp: inputs.otp });
        user = await sails.helpers.general.getLoggedinUser(
          loadedUser.id,
          inputs,
          global.ROLE.USER
        );
        return exits.success({
          status: true,
          message: strings.SIGNED_UP,
          data: user,
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
