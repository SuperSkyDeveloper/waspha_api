const moment = require("moment");

module.exports = {
  friendlyName: "Delete driver",

  description: "",

  inputs: {
    id: {
      type: "number",
      required: true,
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    sails.log("calling action admin/delete-driver");
    let driver = await Driver.findOne({ id: inputs.id });
    if (!driver) {
      return exits.invalid({
        status: false,
        message: "Invalid driver id",
        data: [],
      });
    }

    driver = await Driver.updateOne({ id: inputs.id }).set({
      deletedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    });
    return exits.success({
      status: true,
      message: "Deleted successfully",
      data: [],
    });
  },
};
