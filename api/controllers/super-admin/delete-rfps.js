const moment = require("moment");

module.exports = {
  friendlyName: "Delete rfps",

  description: "",

  inputs: {},

  exits: {
    invalidRequest: {
      description: "Send invalid response",
      responseType: "invalidRequest",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action super-admin/delete-rfps");

    let req = this.req;
    let filter = null;
    if (req.query.filter) {
      filter = JSON.parse(req.query.filter);
      sails.log({ filter: filter.id });
    }

    let rfps = await Request_for_proposal.find({ id: filter.id });
    if (!rfps.length) {
      return exits.invalid({
        status: false,
        message: "Invalid rfps id",
        data: [],
      });
    }

    rfps = await Request_for_proposal.update({ id: filter.id }).set({
      deletedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    });

    return exits.success({
      status: true,
      message: "Deleted successfully",
      data: filter.id,
    });
  },
};
