module.exports = {
  friendlyName: "Delete waspha countries",

  description: "",

  inputs: {
    admin: {
      type: "ref",
      required: true,
      description: "logged in admin",
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
    sails.log("calling action super-admin/delete-waspha-countries");
    try {
      let req = this.req;
      let filter = null;
      if (req.query.filter) {
        filter = JSON.parse(req.query.filter);
        sails.log({ filter: filter.id });
      }

      let waspha_countries = await Waspha_country.find({
        country_id: filter.id,
      });
      if (!waspha_countries.length) {
        return exits.invalid({
          status: false,
          message: sails.config.strings[inputs.admin.language].INVALID_ID,
          data: [],
        });
      }

      await Waspha_country.destroy({ country_id: filter.id });
      return exits.success({
        status: true,
        message: sails.config.strings[inputs.admin.language].DELETED,
        data: [],
      });
    } catch (err) {
      sails.log.error(
        `Error in action super-admin/delete-waspha-countries. ${err}`
      );
      return exits.ok({
        status: false,
        message: sails.config.strings[inputs.admin.language].UNABLE_TO_DELETE,
        data: [],
      });
    }
  },
};
