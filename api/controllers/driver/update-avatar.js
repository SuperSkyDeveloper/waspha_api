module.exports = {
  friendlyName: "Update avatar",

  description: "",

  inputs: {
    driver: {
      type: "ref",
      required: true,
      description: "logged in driver",
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
    sails.log("calling action driver/update-avatar");
    try {
      var rec = { avatar: inputs.avatar };
      is_valid_url = await sails.helpers.isValidUrl(inputs.avatar);
      if (is_valid_url === false) {
        rec.avatar = await sails.helpers.aws.uploadFile(
          inputs.avatar,
          "drivers"
        );
      }

      await Driver.updateOne({ id: inputs.driver.id }).set(rec);
      return exits.success({
        status: true,
        message: sails.config.strings[inputs.driver.language].UPDATED,
        data: { avatar: rec.avatar },
      });
    } catch (err) {
      sails.log.error(
        `Error in updating avatar for driver id ${inputs.driver.id}. ${err}`
      );
      return exits.ok({
        status: false,
        message: sails.config.strings[inputs.driver.language].UNABLE_TO_UPDATE,
        data: [],
      });
    }
  },
};
