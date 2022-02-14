const { requires } = require("grunt");

const moment = require("moment");
module.exports = {
  friendlyName: "Edit profile",

  description: "",

  inputs: {
    user: {
      type: "ref",
      required: true,
      description: "logged in user",
    },
    name: {
      type: "string",
      required: false,
    },
    gender: {
      type: "string",
      required: false,
      isIn: ["male", "female", "other"],
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
    sails.log("calling action user/edit-profile");
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
    if (!_.isEmpty(rec)) {
      sails.log("rec:", rec);
      try {
        var updated = await User.updateOne({ id: inputs.user.id }).set(rec);
        sails.log(`Profile updated for user id ${inputs.user.id}`);
        return exits.success({
          status: true,
          message: sails.config.strings[inputs.user.language].PROFILE_UPDATED,
          data: updated,
        });
      } catch (err) {
        sails.log.error(
          `Error updating profile for user id ${inputs.user.id}. Error: ${err}`
        );
        return exits.ok({
          status: false,
          message: sails.config.strings[inputs.user.language].UNABLE_TO_UPDATE,
          data: [],
        });
      }
    }
    return exits.ok({
      status: true,
      message: sails.config.strings[inputs.user.language].NOTHING_TO_UPDATE,
      data: [],
    });
  },
};
