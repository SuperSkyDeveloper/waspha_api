module.exports = {
  friendlyName: "Delete waspha country",

  description: "",

  inputs: {
    admin: {
      type: "ref",
      required: true,
      description: "logged in admin",
    },
    id: {
      type: "number",
      required: true,
    },
  },

  exits: {
    invalid: {
      responseType: "unauthorized",
      description: "Send 401 if authentication failed",
    },
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action super-admin/delete-waspha-country");
    try {
      let waspha_country = await Waspha_country.findOne({
        country_id: inputs.id,
      });
      if (!waspha_country) {
        return exits.invalid({
          status: false,
          message: sails.config.strings[inputs.admin.language].INVALID_ID,
          data: [],
        });
      }

      await Waspha_country.destroy({ country_id: inputs.id });
      return exits.success({
        status: true,
        message: sails.config.strings[inputs.admin.language].DELETED,
        data: [],
      });
    } catch (err) {
      sails.log.error(
        `Error in action super-admin/delete-waspha-country. ${err}`
      );
      return exits.ok({
        status: false,
        message: sails.config.strings[inputs.admin.language].UNABLE_TO_DELETE,
        data: [],
      });
    }
  },
};
