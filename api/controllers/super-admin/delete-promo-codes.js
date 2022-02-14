const moment = require("moment");

module.exports = {
  friendlyName: "Delete promo codes",

  description: "",

  inputs: {},

  exits: {
    invalidRequest: {
      description: "Send invalid response",
      responseType: "invalidRequest",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action super-admin/delete-promo-codes");

    let req = this.req;
    let filter = null;
    if (req.query.filter) {
      filter = JSON.parse(req.query.filter);
      sails.log({ filter: filter.id });
    }

    let promo_codes = await Promo_code.find({ id: filter.id });
    if (!promo_codes.length) {
      return exits.invalid({
        status: false,
        message: "Invalid promo codes id",
        data: [],
      });
    }

    promo_codes = await Promo_code.update({ id: filter.id }).set({
      deletedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    });

    return exits.success({
      status: true,
      message: "Deleted successfully",
      data: filter.id,
    });
  },
};
