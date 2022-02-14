module.exports = {
  friendlyName: "zone",

  description: "Get all zones.",

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
  },

  fn: async function (inputs, exits) {
    sails.log("calling action admin/get-zones");

    let req = this.req;
    let range = [0, 9];
    if (req.query.range) {
      range = JSON.parse(req.query.range);
    }

    console.log("req.query:", req.query);
    const zones = await Fixed_zone.find({
      where: { deletedAt: null },
      select: ["id", "name"],
    })
      .skip(range[0])
      .limit(range[1] + 1);
    if (zones.length) {
      zones[0].total = await Fixed_zone.count({
        where: { deletedAt: null },
      });
      return exits.success({
        status: true,
        message: sails.config.strings["en"].TOTAL_RECORDS_FOUND.replace(
          "{total}",
          zones.length
        ).replace("{records}", "zones"),
        data: zones,
      });
    }
    return exits.ok({
      status: true,
      message: sails.config.strings["en"].NOT_FOUND,
      data: [],
    });
  },
};
