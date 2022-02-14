const bcrypt = require("bcryptjs");
module.exports = {
  friendlyName: "Signup",

  description: "Signup driver.",

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
    sails.log("calling action driver/signup");
    const strings = sails.config.strings[inputs.language];
    var is_email = _.isString(inputs.user_id);
    let message = strings.INVALID_EMAIL_OR_OTP;
    if (is_email) {
      var user_id = inputs.user_id.toLowerCase();
      driver = await Unverified_driver.findOne({
        email: user_id,
        otp: inputs.otp,
      });
    } else {
      driver = await Unverified_driver.findOne({
        contact: inputs.user_id.number.replace(/\s/g, ""),
        country_code: inputs.user_id.country_code,
        otp: inputs.otp,
      });
      message = strings.INVALID_CONTACT_OR_OTP;
    }
    //  driver = await Unverified_driver.findOne({email: inputs.email, otp: inputs.otp});
    console.log("driver:", driver, inputs);
    if (!driver) {
      sails.log.warn(
        `Unverified Driver with email '${inputs.email}' and otp '${inputs.otp}' not exists, returning response`
      );
      return exits.ok({
        status: false,
        message: message,
        data: [],
      });
    }

    const name = driver.name;
    const email = driver.email;
    const password = driver.password;
    const country_code = driver.country_code;
    const contact = driver.contact;
    const language = driver.language;
    const address = driver.address;
    const lat = driver.lat;
    const lng = driver.lng;
    const gender = driver.gender;
    let document = driver.document;
    const country = driver.country;
    const vehicle_id = driver.vehicle_id;
    const vehicle_name = driver.vehicle_name;
    const number_plate = driver.number_plate;
    const type = global.DRIVER_TYPE.WASPHA_EXPRESS;
    const referral_code = await sails.helpers.general.getReferralCode(
      global.ROLE.DRIVER
    );
    if (driver.referral_code) {
      let where = {};
      where["referral_code"] = driver.referral_code;
      found = await Driver.findOne({ where: where });
      if (found) {
        let setting = await sails.helpers.getSetting("waspha_referral_points");
        await sails.helpers.general.updateLoyaltyPoints(
          found.id,
          global.ROLE.DRIVER,
          setting[0].value
        );
        var referred_by = driver.referral_code;
      }
    }
    sails.log(`Encrypting driver password`);

    sails.log(`Password encrypted, now signing driver up`);
    try {
      let rec = {
        name: name,
        email: email,
        password: password,
        country_code: country_code,
        contact: contact,
        language: language,
        address: address,
        lat: lat,
        lng: lng,
        gender: gender,
        status: false,
        type: type,
        vehicle_id: vehicle_id,
        vehicle_name: vehicle_name,
        number_plate: number_plate,
        referral_code: referral_code,
        is_contact_verified: true,
        is_email_verified: false,
      };
      if (referred_by) {
        rec.referred_by = referred_by;
      }
      var loadedDriver = await Driver.create(rec).fetch();

      if (loadedDriver.id) {
        if (document) {
          document = JSON.parse(document);
          await sails.helpers.general.addOrUpdateDocuments(
            document,
            loadedDriver.id,
            global.ROLE.DRIVER
          );
        }
        await Unverified_driver.destroyOne({ email: email, otp: inputs.otp });
        sails.log(`Driver signed up with email '${inputs.email}'`);
        loadedDriver.is_approved = loadedDriver.status;
        delete loadedDriver.status;
        delete loadedDriver.password;

        driver = await sails.helpers.general.getLoggedinUser(
          loadedDriver.id,
          inputs,
          global.ROLE.DRIVER
        );
        driver.is_approved = Boolean(driver.status);
        driver.vehicle = {
          id: driver.vehicle_id,
          name: driver.vehicle_name,
          number_plate: driver.number_plate,
          is_verified: true,
        };

        driver.is_zone_selected = Boolean(driver.is_zone_selected);
        driver.fixed_zone_id = null;
        fixed_zone = await Driver_fixed_zone.find({
          driver_id: driver.id,
        }).limit(1);
        if (fixed_zone.length) {
          driver.fixed_zone_id = fixed_zone[0].fixed_zone_id;
        }
        driver.fixed_zones = await sails.helpers.getFixedZones();

        return exits.success({
          status: true,
          message: strings.SIGNED_UP,
          data: driver,
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
