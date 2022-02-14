const moment = require("moment");

module.exports = {
  friendlyName: "Delete user",

  description: "",

  inputs: {
    id: {
      type: "number",
      required: true,
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    sails.log("calling action admin/delete-user");
    let user = await User.findOne({ id: inputs.id });
    if (!user) {
      return exits.invalid({
        status: false,
        message: "Invalid user id",
        data: [],
      });
    }

    user = await User.updateOne({ id: inputs.id }).set({
      deletedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    });
    return exits.success({
      status: true,
      message: "Deleted successfully",
      data: [],
    });
  },
};
