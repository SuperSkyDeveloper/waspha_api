module.exports = {
  friendlyName: "Get fixed zones",

  description: "",

  inputs: {
    id: {
      type: "number",
      required: false,
    },
  },

  exits: {
    success: {
      outputFriendlyName: "Fixed zones",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("helper get-fixed-zones started");
    try {
      let where = { deletedAt: null };
      if (!_.isUndefined(inputs.id)) {
        where.id = inputs.id;
      }
      let fixed_zones = await Fixed_zone.find({
        select: ["name"],
        where,
      })
        .populate("latlng")
        .populate("slots");

      //.populate("slots", { select: ["vehicle_id", "allowed_slots"] });
      sails.log("helper get-fixed-zones ended");
      if (fixed_zones.length) {
        return exits.success(fixed_zones);
      }
      return exits.success([]);
    } catch (err) {
      sails.log.error(`Error in helper get-fixed-zones. ${err}`);
      return exits.success([]);
    }
  },
};
