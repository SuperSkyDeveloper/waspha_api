const moment = require("moment");

module.exports = {
  friendlyName: "Delete zone",

  description: "",

  inputs: {
    id: {
      type: "number",
      required: true,
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    sails.log("calling action admin/delete-zone");
    let zone = await Fixed_zone.findOne({ id: inputs.id }).populate("drivers");

    if (!zone) {
      return exits.invalid({
        status: false,
        message: "Invalid zone id",
        data: [],
      });
    }

    let driver_ids = _.map(zone.drivers, "driver_id");
    await Driver.update({ id: driver_ids }).set({ is_zone_selected: false });
    await Driver_fixed_zone.destroy({ fixed_zone_id: zone.id });
    await Fixed_zone_coordinate.destroy({ fixed_zone_id: zone.id });
    await Fixed_zone_allowed_slot.destroy({ fixed_zone_id: zone.id });
    await Fixed_zone.destroy({ id: zone.id });
    // zone = await zone.updateOne({ id: inputs.id }).set({
    //   deletedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    // });
    return exits.success({
      status: true,
      message: "Deleted successfully",
      data: [],
    });
  },
};
