module.exports = {
  friendlyName: "Get delivery vehicle",

  description: "Get all delivery vehicle.",

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
    sails.log("calling action super-admin/get-delivery-vehicles");

    let req = this.req;
    sails.log({ reqQuery: JSON.stringify(req.query) });
    let range = [0, 9];
    if (req.query.range) {
      range = JSON.parse(req.query.range);
    }

    var sort = await sails.helpers.getSortFilters.with({ req });

    let where = { id: { "!=": null } };
    if (req.query.filter) {
      let filter = JSON.parse(req.query.filter);

      if (filter.q) {
        where.or = [
          { title: { contains: filter.q } },
          { subtitle: { contains: filter.q } },
          { title_ar: { contains: filter.q } },
          { subtitle_ar: { contains: filter.q } },
        ];
      }
    }

    let delivery_vehicles = await Delivery_vehicle.find({
      where: where,
    })
      .skip(range[0])
      .limit(range[1] - range[0] + 1)
      .sort(sort);
    if (delivery_vehicles.length) {
      delivery_vehicles[0].total = await Delivery_vehicle.count({
        where: where,
      });
      return exits.success({
        status: true,
        message: sails.config.strings["en"].TOTAL_RECORDS_FOUND.replace(
          "{total}",
          delivery_vehicles.length
        ).replace("{records}", "delivery vehicles"),
        data: delivery_vehicles,
      });
    }
    return exits.notFound({
      status: false,
      message: "Not found",
      data: [],
    });
  },
};
