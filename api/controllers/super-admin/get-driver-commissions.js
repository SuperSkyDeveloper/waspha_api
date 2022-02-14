module.exports = {
  friendlyName: "Get driver commissions",

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
    sails.log("calling action super-admin/get-driver-commissions");
    //sails.log(await Waspha_commission.find().populate("country"));
    try {
      let req = this.req;
      let range = [0, 9];
      flag = false;
      if (req.query.range) {
        range = JSON.parse(req.query.range);
      }
      let commissions = [];
      if (req.query.filter) {
        let filter = JSON.parse(req.query.filter);

        if (filter.q) {
          let where = {
            key: [
              "waspha_fee_normal",
              "waspha_fee_normal_type",
              "waspha_fee_traditional",
              "waspha_fee_traditional_type",
            ],
          };
          where.or = [
            { key: { contains: filter.q } },
            { display_name: { contains: filter.q } },
            { value: { contains: filter.q } },
          ];
          commissions = await Waspha_commission_driver.find(where)
            .populate("country")
            .sort("key ASC")
            .skip(range[0])
            .limit(range[1] + 1);
        } else {
          flag = true;
        }
      }
      if (flag) {
        let where = {
          key: [
            "waspha_fee_normal",
            "waspha_fee_normal_type",
            "waspha_fee_traditional",
            "waspha_fee_traditional_type",
          ],
        };
        commissions = await Waspha_commission_driver.find()
          .populate("country")
          .sort("id ASC")
          .skip(range[0])
          .limit(range[1] - range[0] + 1);
      }

      console.log({ query: req.query, commissions: commissions.length });

      if (commissions.length) {
        commissions[0].total = commissions.length;
        return exits.success({
          status: true,
          data: commissions,
        });
      }
      return exits.ok({
        status: false,
        data: [],
      });
    } catch (err) {
      sails.log.error(`Error in action super-admin/get-commissions. ${err}`);
      return exits.notFound({
        status: false,
        data: [],
      });
    }
  },
};
