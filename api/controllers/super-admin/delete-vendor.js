const moment = require("moment");

module.exports = {
  friendlyName: "Delete vendor",

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
    sails.log("calling action admin/delete-vendor");
    let store = await Store.findOne({ id: inputs.id });
    if (!store) {
      return exits.invalid({
        status: false,
        message: "Invalid store id",
        data: [],
      });
    }

    store = await Store.updateOne({ id: inputs.id }).set({
      deletedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    });
    vendor = await Vendor.updateOne({ id: store.vendor_id }).set({
      deletedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    });
    return exits.success({
      status: true,
      message: "Deleted successfully",
      data: [],
    });
  },
};
