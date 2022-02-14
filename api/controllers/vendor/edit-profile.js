module.exports = {
  friendlyName: "Edit profile",

  description: "",

  inputs: {
    vendor: {
      type: "ref",
      required: true,
      description: "logged in vendor",
    },
    name: {
      type: "string",
      required: false,
    },
    gender: {
      type: "string",
      required: false,
      isIn: ["male", "female"],
    },
    dob: {
      type: "string",
      required: false,
    },
    language: {
      type: "string",
      required: false,
      isIs: ["en", "ar", "EN", "AR"],
    },
    country: {
      type: "string",
      required: false,
    },
    avatar: {
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
    sails.log("calling action vendor/edit-profile");
    let rec = {};
    if (inputs.name) {
      rec.name = inputs.name;
    }
    if (inputs.gender) {
      rec.gender = inputs.gender;
    }
    if (inputs.dob) {
      rec.dob = new Date(inputs.dob);
      //rec.dob = moment(inputs.dob, 'YYYY-MM-DD');
    }
    if (inputs.language) {
      rec.language = inputs.language.toLowerCase();
    }
    if (inputs.avatar) {
      rec.avatar = inputs.avatar;
    }
    if (!_.isEmpty(rec)) {
      sails.log("rec:", rec);
      try {
        var updated = await Vendor.updateOne({ id: inputs.vendor.id }).set(rec);
        if (inputs.country) {
          updated.currency_code = await sails.helpers.general.attachCountry(
            updated.id,
            updated.country_code,
            global.ROLE.VENDOR,
            inputs.country
          );
        }
        sails.log(`Profile updated for vendor id ${inputs.vendor.id}`);
        delete updated.password;
        delete updated.device_token;
        return exits.success({
          status: true,
          message: sails.config.strings[inputs.vendor.language].PROFILE_UPDATED,
          data: updated,
        });
      } catch (err) {
        sails.log.error(
          `Error updating profile for vendor id ${inputs.vendor.id}. Error: ${err}`
        );
        return exits.ok({
          status: false,
          message:
            sails.config.strings[inputs.vendor.language].UNABLE_TO_UPDATE,
          data: [],
        });
      }
    }
    return exits.ok({
      status: true,
      message: sails.config.strings[inputs.vendor.language].NOTHING_TO_UPDATE,
      data: [],
    });
  },
};
