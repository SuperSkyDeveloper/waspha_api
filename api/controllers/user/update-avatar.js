module.exports = {
  friendlyName: "Update avatar",

  description: "",

  inputs: {
    user: {
      type: "ref",
      required: true,
      description: "logged in user",
    },
    avatar: {
      type: "string",
      required: true,
    },
  },

  exits: {
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
    serverError: {
      description: "send server error",
      responseType: "serverError",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action user/update-avatar");
    try {
      var rec = {};
      let is_valid_url = await sails.helpers.isValidUrl(inputs.avatar);
      if (is_valid_url === false) {
        rec.avatar = await sails.helpers.aws.uploadFile(inputs.avatar, "users");
      } else {
        rec.avatar = inputs.avatar;
      }

      await User.updateOne({ id: inputs.user.id }).set(rec);
      return exits.success({
        status: true,
        message: sails.config.strings[inputs.user.language].UPDATED,
        data: { avatar: rec.avatar },
      });
    } catch (err) {
      sails.log.error(
        `Error in updating avatar for user id ${inputs.user.id}. ${err}`
      );
      return exits.ok({
        status: false,
        message: sails.config.strings[inputs.user.language].UNABLE_TO_UPDATE,
        data: [],
      });
    }
  },
};
