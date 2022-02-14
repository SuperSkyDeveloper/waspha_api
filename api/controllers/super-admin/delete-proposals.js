const moment = require("moment");

module.exports = {
  friendlyName: "Delete proposals",

  description: "",

  inputs: {},

  exits: {
    invalidRequest: {
      description: "Send invalid response",
      responseType: "invalidRequest",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action super-admin/delete-proposals");

    let req = this.req;
    let filter = null;
    if (req.query.filter) {
      filter = JSON.parse(req.query.filter);
      sails.log({ filter: filter.id });
    }

    let proposals = await Proposal.find({ id: filter.id });
    if (!proposals.length) {
      return exits.invalid({
        status: false,
        message: "Invalid proposals id",
        data: [],
      });
    }

    proposals = await Proposal.update({ id: filter.id }).set({
      deletedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    });

    return exits.success({
      status: true,
      message: "Deleted successfully",
      data: filter.id,
    });
  },
};
