module.exports = {
  friendlyName: "Get waspha countries",

  description: "",

  inputs: {},

  exits: {},

  fn: async function (inputs) {
    // All done.
    return;
  },
};

module.exports = {
  friendlyName: "Get waspha countries",

  description: "Get all waspha countries.",

  inputs: {
    // admin: {
    //   type: 'ref',
    //   required: true,
    //   description: 'logged in admin'
    // },
  },

  exits: {
    unauthorized: {
      responseType: "unauthorized",
      description: "Send 401 if authentication failed",
    },
    ok: {
      responseType: "ok",
      description: "Send ok response",
    },
    notFound: {
      responseType: "notFound",
      description: "Send notFound response",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action super-admin/get-waspha-countries");
    try {
      let req = this.req;
      sails.log({ reqQuery: JSON.stringify(req.query) });
      let range = [0, 9];
      if (req.query.range) {
        range = JSON.parse(req.query.range);
      }

      var sort = await sails.helpers.getSortFilters(req, true);

      let where = {};
      if (req.query.filter) {
        let filter = JSON.parse(req.query.filter);

        if (filter.q) {
          where.or = [
            { en: { contains: filter.q } },
            { ar: { contains: filter.q } },
            { id: { contains: filter.q } },
            { country_code: { contains: filter.q } },
          ];
        }
      }
      let wc = await Waspha_country.find();
      if (wc.length) {
        waspha_coutry_ids = _.map(wc, "country_id");
        where.id = waspha_coutry_ids;
      }

      let waspha_countries = await Country.find({
        where: where,
        select: ["id", "en", "ar", "country_code", "dial_code"],
      })

        .skip(range[0])
        .limit(range[1] - range[0] + 1)
        .sort(sort);
      if (waspha_countries.length) {
        waspha_countries[0].total = await Waspha_country.count({
          country_id: waspha_coutry_ids,
        });
        return exits.success({
          status: true,
          message: sails.config.strings["en"].TOTAL_RECORDS_FOUND.replace(
            "{total}",
            waspha_countries.length
          ).replace("{records}", "waspha countries"),
          data: waspha_countries,
        });
      }
      return exits.ok({
        status: false,
        message: "",
        data: [],
      });
    } catch (err) {
      sails.log(`Error in action super-admin/get-waspha-countries. ${err}`);
    }
  },
};
