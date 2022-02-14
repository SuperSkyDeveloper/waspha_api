const moment = require("moment");

module.exports = {
  friendlyName: "Delete category",

  description: "",

  inputs: {
    id: {
      type: "number",
      required: true,
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    sails.log("calling action super-admin/delete-category");
    let category = await Category.findOne({ id: inputs.id });
    if (!category) {
      return exits.invalid({
        status: false,
        message: "Invalid category id",
        data: [],
      });
    }

    category = await Category.updateOne({ id: inputs.id }).set({
      deletedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    });
    return exits.success({
      status: true,
      message: "Deleted successfully",
      data: [],
    });
  },
};
