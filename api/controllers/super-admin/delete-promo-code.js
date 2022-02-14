const moment = require("moment");
module.exports = {
  friendlyName: "Delete promo code",

  description: "",

  inputs: {
    id: {
      type: "number",
      required: true,
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    sails.log("calling action super-admin/delete-promo_code");
    let promo_code = await Promo_code.findOne({ id: inputs.id });
    if (!promo_code) {
      return exits.invalid({
        status: false,
        message: "Invalid promo code id",
        data: [],
      });
    }

    promo_code = await Promo_code.updateOne({ id: inputs.id }).set({
      deletedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    });
    return exits.success({
      status: true,
      message: "Deleted successfully",
      data: [],
    });
  },
};
