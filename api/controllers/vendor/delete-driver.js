const moment = require("moment");
module.exports = {
  friendlyName: "Delete driver",

  description: "",

  inputs: {
    vendor: {
      type: "ref",
      required: true,
      description: "logged in vendor",
    },
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
  },

  fn: async function (inputs, exits) {
    sails.log("calling action vendor/delete-driver");

    let driver = await Driver.findOne({
      id: inputs.id,
      store_id: inputs.vendor.store.id,
    });
    if (!driver) {
      return exits.ok({
        status: false,
        data: [],
        message: sails.config.strings[inputs.vendor.language].INVALID_DRIVER_ID,
      });
    }

    driver = await Driver.updateOne({ id: inputs.id }).set({
      deletedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    });

    if (driver.id) {
      sails.log(`driver deleted with email '${driver.email}'`);

      return exits.success({
        status: true,
        data: [],
        message: sails.config.strings[inputs.vendor.language].DRIVER_DELETED,
      });
    }
  },
};
