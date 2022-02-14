module.exports = {
  friendlyName: "Get Categories",

  description: "Get all categories.",

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
    sails.log("calling action super-admin/get-categories");
    try {
      let req = this.req;
      sails.log({ reqQuery: JSON.stringify(req.query) });
      let range = [0, 9];
      if (req.query.range) {
        range = JSON.parse(req.query.range);
      }

      var sort = await sails.helpers.getSortFilters(req, true);

      let where = { deletedAt: null };
      if (req.query.filter) {
        let filter = JSON.parse(req.query.filter);

        if (filter.q) {
          where.or = [
            { name: { contains: filter.q } },
            { slug: { contains: filter.q } },
          ];
        }
        if (filter.parent_id) {
          where.parent_id = filter.parent_id;
        }
      }

      // let order = sort[0];
      // order = Object.keys(order).map((key) => [key, order[key]])[0];
      // sails.log({ oder: order });
      let order = sort.split(" ");
      switch (order[0]) {
        case "name.en": {
          sort = `en ${order[1]}`;
          break;
        }
        case "name.ar": {
          sort = `ar ${order[1]}`;
          break;
        }
        case "parent.en": {
          sort = `en ${order[1]}`;
          break;
        }
      }
      sails.log({ sortaaaaa: sort });
      let categories = await Category.find({
        where: where,
        select: [
          "id",
          "name",
          "en",
          "ar",
          "slug",
          "description",
          "createdAt",
          "image",
        ],
      })
        .populate("parent_id")
        .skip(range[0])
        .limit(range[1] - range[0] + 1)
        .sort(sort);
      if (categories.length) {
        let timeouts = await Category_timeout.find({
          category: _.map(categories, "id"),
        });
        categories = categories.map((obj) => {
          let timeout = _.find(timeouts, { category: obj.id });
          obj.has_timeouts = !_.isUndefined(timeout);
          obj.name = { en: obj.en, ar: obj.ar };
          obj.parent = obj.parent_id;
          obj.parent_id = obj.parent != null ? obj.parent.id : null;
          if (obj.parent) {
            obj.parent.name = {
              en: obj.parent.en,
              ar: obj.parent.ar,
            };
          }

          return obj;
        });
        categories[0].total = await Category.count({ where: where });
        return exits.success({
          status: true,
          message: sails.config.strings["en"].TOTAL_RECORDS_FOUND.replace(
            "{total}",
            categories.length
          ).replace("{records}", "categories"),
          data: categories,
        });
      }
      return exits.ok({
        status: false,
        message: "",
        data: [],
      });
    } catch (err) {
      sails.log(`Error in action super-admin/get-categories. ${err}`);
    }
  },
};
