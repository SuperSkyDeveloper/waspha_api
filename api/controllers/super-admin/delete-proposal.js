const moment = require("moment");

module.exports = {
  friendlyName: "Delete proposal",

  description: "",

  inputs: {
    id: {
      type: "number",
      required: true,
    },
  },

  exits: {
    serverError: {
      description: "send server error",
      responseType: "serverError",
    },
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
    invalid: {
      description: "Send invalid response",
      responseType: "invalidRequest",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action super-admin/delete-proposal");
    let proposal = await Proposal.findOne({ id: inputs.id });
    if (!proposal) {
      return exits.invalid({
        status: false,
        message: "Invalid order id",
        data: [],
      });
    }

    proposal = await Proposal.updateOne({ id: inputs.id }).set({
      deletedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    });
    return exits.success({
      status: true,
      message: "Deleted successfully",
      data: [],
    });
  },
};
