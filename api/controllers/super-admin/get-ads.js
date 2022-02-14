module.exports = {
  friendlyName: "Get ads",

  description: "Get all ads.",

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
    sails.log("calling action super-admin/get-ads");

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
        where.or = [{ type: { contains: filter.q } }];
      }
    }

    let ads = await Ad.find({
      where: where,
      select: [
        "id",
        "type",
        "is_requested",
        "category_id",
        "subcategory_id",
        "description",
        "createdAt",
        "media",
        "start_time",
        "end_time",
        "radius",
      ],
    })
      .populate("category_id")
      .populate("subcategory_id")
      .skip(range[0])
      .limit(range[1] - range[0] + 1)
      .sort(sort);

    if (ads.length) {
      ads = ads.map((obj) => {
        obj.type = obj.type;
        obj.type_description = global.AD_TYPE.DESCRIPTION[obj.type];
        if (obj.description) {
          obj.description = JSON.parse(obj.description);
          obj.description = { en: obj.description.en, ar: obj.description.ar };
        }
        if (obj.media) {
          obj.media = JSON.parse(obj.media);
          obj.media = { en: obj.media.en, ar: obj.media.ar };
        }

        if (obj.category_id) {
          obj.category = {
            id: obj.category_id.id,
            name: obj.category_id.en || obj.category_id.ar,
          };
          delete obj.category_id;
        }
        if (obj.subcategory_id) {
          obj.subcategory = {
            id: obj.subcategory_id.id,
            name: obj.subcategory_id.en || obj.subcategory_id.ar,
          };
          delete obj.subcategory_id;
        }
        return obj;
      });
      ads[0].total = await Ad.count({ where: where });
      return exits.success({
        status: true,
        message: sails.config.strings["en"].TOTAL_RECORDS_FOUND.replace(
          "{total}",
          ads.length
        ).replace("{records}", "ads"),
        data: ads,
      });
    }
    return exits.notFound({
      status: false,
      message: "Not found",
      data: [],
    });
  },
};
