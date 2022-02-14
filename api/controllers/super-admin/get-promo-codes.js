module.exports = {
  friendlyName: "Get promo codes",

  description: "Get all promo codes.",

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
    notFound: {
      responseType: "notFound",
      description: "Send notFound response",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action super-admin/get-promo-codes");

    let req = this.req;
    sails.log({ reqQuery: JSON.stringify(req.query) });
    let range = [0, 9];
    if (req.query.range) {
      range = JSON.parse(req.query.range);
    }

    var sort = await sails.helpers.getSortFilters.with({ req });

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

    let promo_codes = await Promo_code.find({
      where: where,
      select: [
        "id",
        "promo_code",
        "is_requested",
        "category_id",
        "subcategory_id",
        "description",
        "image",
        "createdAt",
        "image",
        "discount",
        "start_time",
        "end_time",
      ],
    })
      .populate("category_id")
      .populate("subcategory_id")
      .skip(range[0])
      .limit(range[1] - range[0] + 1)
      .sort(sort);
    if (promo_codes.length) {
      promo_codes = promo_codes.map((obj) => {
        if (obj.description) {
          obj.description = JSON.parse(obj.description);
          obj.description = { en: obj.description.en, ar: obj.description.ar };
        }
        if (obj.image) {
          obj.image = JSON.parse(obj.image);
          obj.image = { en: obj.image.en, ar: obj.image.ar };
        }

        if (obj.category_id) {
          obj.category = {
            id: obj.category_id.id,
            name: obj.category_id.name || obj.category_id.ar,
          };
          delete obj.category_id;
        }
        if (obj.subcategory_id) {
          obj.subcategory = {
            id: obj.subcategory_id.id,
            name: obj.subcategory_id.name || obj.subcategory_id.ar,
          };
          delete obj.subcategory_id;
        }
        return obj;
      });
      promo_codes[0].total = await Promo_code.count({ where: where });
      return exits.success({
        status: true,
        message: sails.config.strings["en"].TOTAL_RECORDS_FOUND.replace(
          "{total}",
          promo_codes.length
        ).replace("{records}", "promo_codes"),
        data: promo_codes,
      });
    }
    return exits.notFound({
      status: false,
      message: "Not found",
      data: [],
    });
  },
};
