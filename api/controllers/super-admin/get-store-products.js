module.exports = {
  friendlyName: "Get store products",

  description: "Get all store products.",

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
    sails.log("calling action super-admin/get-store-products");

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
      case "category.en": {
        sort = `en ${order[1]}`;
        break;
      }
    }
    sails.log({ sortaaaaa: sort });
    let store_products = await Store_product.find({
      where: where,
      select: ["id", "title", "title_ar", "category_id", "createdAt"],
    })
      .populate("category_id")
      .skip(range[0])
      .limit(range[1] - range[0] + 1)
      .sort(sort);
    if (store_products.length) {
      store_products = store_products.map((obj) => {
        obj.category = obj.category_id;
        obj.category_id = obj.category != null ? obj.category.id : null;
        if (obj.category) {
          obj.category.name = {
            en: obj.category.en,
            ar: obj.category.ar,
          };
        }

        return obj;
      });
      store_products[0].total = await Store_product.count({ where: where });
      return exits.success({
        status: true,
        message: sails.config.strings["en"].TOTAL_RECORDS_FOUND.replace(
          "{total}",
          store_products.length
        ).replace("{records}", "store_products"),
        data: store_products,
      });
    }
    return exits.ok({
      status: false,
      message: "",
      data: [],
    });
  },
};
