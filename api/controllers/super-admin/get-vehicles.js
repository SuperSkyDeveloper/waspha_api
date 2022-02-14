module.exports = {
  friendlyName: "Role",

  description: "Get all vehicles.",

  inputs: {},

  exits: {
    unauthorized: {
      responseType: "unauthorized",
      description: "Send 401 if authentication failed",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action admin/get-vehicles");

    let req = this.req;
    let range = [0, 9];
    if (req.query.range) {
      range = JSON.parse(req.query.range);
    }

    console.log("req.query:", req.query);
    const vehicles = await Delivery_vehicle.find({
      where: { deletedAt: null },
      select: ["id", "name", "display_name"],
    })
      .skip(range[0])
      .limit(range[1] + 1);
    if (vehicles.length) {
      return exits.success({
        status: true,
        message: sails.config.strings["en"].TOTAL_RECORDS_FOUND.replace(
          "{total}",
          vehicles.length
        ).replace("{records}", "Vehicles"),
        data: vehicles,
      });
    }
    return exits.ok({
      status: true,
      message: sails.config.strings["en"].NOT_FOUND,
      data: [],
    });
  },
};
