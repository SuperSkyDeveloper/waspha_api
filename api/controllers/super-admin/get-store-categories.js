module.exports = {
  friendlyName: "Get store categories",

  description: "Get all store categories.",

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
    sails.log("calling action super-admin/get-store-categories");

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
          { id: { contains: filter.q } },
          { title: { contains: filter.q } },
          { title_ar: { contains: filter.q } },
          { description: { contains: filter.q } },
          { description_ar: { contains: filter.q } },
        ];
      }
      if (filter.store_id) {
        where.store_id = filter.store_id;
      }
      if (filter.product_id) {
        //alternate way to get store_id from product_id
        store_product = await Store_product.findOne({
          where: { id: filter.product_id },
          select: ["store_id"],
        });
        if (store_product) {
          where.store_id = store_product.store_id;
        }
      }
      if (!_.isUndefined(filter.id) && filter.id.length) {
        //alternate way to get store_id from category
        store_cat = await Business_category.findOne({
          where: { id: filter.id[0] },
          select: ["store_id"],
        });
        if (store_cat) {
          where.store_id = store_cat.store_id;
        }
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
    let store_categories = await Business_category.find({
      where: where,
      select: ["id", "name", "name_ar", "parent_id", "slug", "createdAt"],
    })
      .populate("parent_id")
      .skip(range[0])
      .limit(range[1] - range[0] + 1)
      .sort(sort);
    if (store_categories.length) {
      store_categories = store_categories.map((obj) => {
        obj.display_name = obj.name || obj.name_ar;
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
      store_categories[0].total = await Business_category.count({
        where: where,
      });
      return exits.success({
        status: true,
        message: sails.config.strings["en"].TOTAL_RECORDS_FOUND.replace(
          "{total}",
          store_categories.length
        ).replace("{records}", "Store Categories"),
        data: store_categories,
      });
    }
    return exits.ok({
      status: false,
      message: "",
      data: [],
    });
  },
};
