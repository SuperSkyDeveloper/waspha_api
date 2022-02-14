module.exports = {
  friendlyName: "Get settings",

  description: "",

  inputs: {},

  exits: {
    unauthorized: {
      responseType: "unauthorized",
      description: "Send 401 if authentication failed",
    },
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
    notFound: {
      description: "Send notFound response",
      responseType: "notFound",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action super-admin/get-settings");
    try {
      let req = this.req;
      let range = [0, 9];
      flag = false;
      if (req.query.range) {
        range = JSON.parse(req.query.range);
      }
      let settings = [];
      if (req.query.filter) {
        let filter = JSON.parse(req.query.filter);

        if (filter.q) {
          let where = {
            key: ["waspha_penalty_fee_driver", "waspha_referral_points"],
          };
          where.or = [
            { key: { contains: filter.q } },
            { display_name: { contains: filter.q } },
            { value: { contains: filter.q } },
          ];
          settings = await Setting.find(where)
            .sort("key ASC")
            .skip(range[0])
            .limit(range[1] + 1);
        } else {
          flag = true;
        }
      }
      if (flag) {
        let where = {
          key: ["waspha_penalty_fee_driver", "waspha_referral_points"],
        };
        settings = await Setting.find(where)
          .sort("key ASC")
          .skip(range[0])
          .limit(range[1] - range[0] + 1);
      }

      console.log({ query: req.query, settings: settings.length });

      if (settings.length) {
        settings[0].total = settings.length;
        return exits.success({
          status: true,
          data: settings,
        });
      }
      return exits.ok({
        status: false,
        data: [],
      });
    } catch (err) {
      sails.log.error(`Error in action super-admin/get-settings. ${err}`);
      return exits.notFound({
        status: false,
        data: [],
      });
    }
  },
};
