const moment = require("moment");

module.exports = {
  friendlyName: "Delete rfp",

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
    sails.log("calling action super-admin/delete-rfp");
    let rfp = await Request_for_proposal.findOne({ id: inputs.id });
    if (!rfp) {
      return exits.invalid({
        status: false,
        message: "Invalid order id",
        data: [],
      });
    }

    rfp = await Request_for_proposal.updateOne({ id: inputs.id }).set({
      deletedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    });
    return exits.success({
      status: true,
      message: "Deleted successfully",
      data: [],
    });
  },
};
