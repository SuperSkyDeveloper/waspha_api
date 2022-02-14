module.exports = {
  friendlyName: "Get delivery vehicle charges",

  description: "Get all delivery vehicle charges.",

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
    sails.log("calling action super-admin/get-delivery-vehicle-charges");

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
          { name: { contains: filter.q } },
          { slug: { contains: filter.q } },
        ];
      }
      if (filter.parent_id) {
        where.parent_id = filter.parent_id;
      }
    }

    let delivery_vehicle_charges = await Delivery_vehicle_charge.find({
      where: where,
      select: ["id", "base_fee", "fee_per_minute", "fee_per_km"],
    })
      .populate("country")
      .populate("delivery_vehicle")
      //.skip(range[0])
      //.limit(range[1] - range[0] + 1)
      .sort(sort);
    if (delivery_vehicle_charges.length) {
      let temp = {
        id: delivery_vehicle_charges[0].country.id,
        country: delivery_vehicle_charges[0].country.en,
        charges: [],
      };

      let all_charges = [];
      for (obj of delivery_vehicle_charges) {
        if (obj.country.id != temp.id) {
          all_charges.push(temp);

          temp = { id: obj.country.id, country: obj.country.en, charges: [] };
        }
        let temp2 = {};
        temp2.id = obj.delivery_vehicle.id;
        temp2.delivery_vehicle = obj.delivery_vehicle.display_name;
        temp2.base_fee = obj.base_fee;
        temp2.fee_per_km = obj.fee_per_km;
        temp2.fee_per_minute = obj.fee_per_minute;
        temp.charges.push(temp2);
      }
      all_charges.push(temp);
      all_charges[0].total = await Delivery_vehicle_charge.count({
        where: where,
      });
      return exits.success({
        status: true,
        message: sails.config.strings["en"].TOTAL_RECORDS_FOUND.replace(
          "{total}",
          delivery_vehicle_charges.length
        ).replace("{records}", "delivery vehicle charges"),
        data: all_charges,
      });
    }
    return exits.notFound({
      status: false,
      message: "Not found",
      data: [],
    });
  },
};
