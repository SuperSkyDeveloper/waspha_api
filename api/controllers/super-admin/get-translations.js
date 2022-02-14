module.exports = {
  friendlyName: "Get translations",

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
    sails.log("calling action super-admin/get-translations");
    try {
      let req = this.req;
      let range = [0, 9];
      flag = false;
      if (req.query.range) {
        range = JSON.parse(req.query.range);
      }
      let translations = [];
      if (req.query.filter) {
        let filter = JSON.parse(req.query.filter);

        if (filter.q) {
          var where = {};
          where.or = [
            { key: { contains: filter.q } },
            { en: { contains: filter.q } },
            { ar: { contains: filter.q } },
          ];
          translations = await Waspha_translation_all.find(where)
            .sort("key ASC")
            .skip(range[0])
            .limit(range[1] - range[0] + 1);
          sails.log({ range0: range[0], range1: range[1] });
        } else {
          flag = true;
        }
      }
      if (flag) {
        translations = await Waspha_translation_all.find()
          .sort("key ASC")
          .skip(range[0])
          .limit(range[1] - range[0] + 1);
      }

      console.log({ query: req.query, translations: translations.length });

      if (translations.length) {
        translations[0].total = await Waspha_translation_all.count(where);
        return exits.success({
          status: true,
          data: translations,
        });
      }
    } catch (err) {
      sails.log.error(`Error in action super-admin/get-translations. ${err}`);
      return exits.notFound({
        status: false,
        data: [],
      });
    }
  },
};
