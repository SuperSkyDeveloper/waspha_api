module.exports = {
  friendlyName: "Country",

  description: "Get all Countries.",

  inputs: {
    admin: {
      type: "ref",
      required: true,
      description: "logged in admin",
    },
  },

  exits: {
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action admin/get-countries");
    try {
      let req = this.req;

      let range = [0, 9];
      if (req.query.range) {
        range = JSON.parse(req.query.range);
      }

      //console.log("type of:", req.query);
      var sort = await sails.helpers.getSortFilters.with({ req });
      let = waspha_coutry_ids = [];
      let waspha_countries = await Waspha_country.find();
      if (waspha_countries.length) {
        waspha_coutry_ids = _.map(waspha_countries, "country_id");
      }
      let where = { id: waspha_coutry_ids };
      if (req.query.filter) {
        let filter = JSON.parse(req.query.filter);
        if (!_.isUndefined(filter.view)) {
          switch (filter.view) {
            case "create_waspha_country": {
              where.id = { "!=": waspha_coutry_ids };
              break;
            }
            case "create_waspha_commission": {
              let commission_countries = await Waspha_commission.find({
                select: ["country"],
              });
              commission_coutry_ids = _.map(commission_countries, "country");
              where.and = [
                { id: waspha_coutry_ids },
                { id: { "!=": commission_coutry_ids } },
              ];
              break;
            }
            case "create_waspha_commission_driver": {
              let commission_countries = await Waspha_commission_driver.find({
                select: ["country"],
              });
              commission_coutry_ids = _.map(commission_countries, "country");
              where.and = [
                { id: waspha_coutry_ids },
                { id: { "!=": commission_coutry_ids } },
              ];
              break;
            }
          }
        }
      }
      if (inputs.admin.role.name == global.ROLE.ADMIN) {
        where.id = inputs.admin.country.id;
      }

      var countries = await Country.find({
        where: where,
        select: ["id", "en", "ar", "country_code"],
      })
        .skip(range[0])
        //.limit(range[1]+1)
        .sort("id ASC");

      // .sort(sort);
      // this.res.set({
      //  'Content-Range': 'Countries 0-24/319'

      // })
      this.req.headers["content-range"] = 1000;
      for (country of countries) {
        country.name = {
          en: country.en,
          ar: country.ar,
        };
      }
      countries[0].total = await Waspha_country.count();
      return exits.success({
        status: true,
        message: sails.config.strings["en"].TOTAL_RECORDS_FOUND.replace(
          "{total}",
          countries.length
        ).replace("{records}", "countries"),
        data: countries,
      });
    } catch (err) {
      sails.log.error(`Error in action super-admin/get-countries. ${err}`);
      return exits.ok({
        status: false,
        message: "",
      });
    }
  },
};
