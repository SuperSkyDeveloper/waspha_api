module.exports = {
  friendlyName: "Get screen contents",

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
    sails.log("calling action super-admin/get-screen-contents");
    try {
      let req = this.req;
      let range = [0, 9];
      flag = false;
      if (req.query.range) {
        range = JSON.parse(req.query.range);
      }
      let waspha_setting = [];
      // if (req.query.filter) {
      //   let filter = JSON.parse(req.query.filter);

      //   if (filter.q) {
      //     let where = {};
      //     where.or = [
      //       { key: { contains: filter.q } },
      //       { en: { contains: filter.q } },
      //       { ar: { contains: filter.q } },
      //     ];
      //     waspha_setting = await Waspha_translation_all.find(where)
      //       .sort("key ASC")
      //       .skip(range[0])
      //       .limit(range[1] + 1);
      //   } else {
      //     flag = true;
      //   }
      // }

      waspha_setting = await Waspha_setting.find()
        .sort("key ASC")
        .skip(range[0])
        .limit(range[1] - range[0] + 1);

      console.log({ query: req.query, waspha_setting: waspha_setting.length });

      if (waspha_setting.length) {
        waspha_setting[0].total = await Waspha_setting.count();
        return exits.success({
          status: true,
          data: waspha_setting,
        });
      }
    } catch (err) {
      sails.log.error(
        `Error in action super-admin/get-screen-contents. ${err}`
      );
      return exits.notFound({
        status: false,
        data: [],
      });
    }
  },
};
