module.exports = {
  friendlyName: "Assign waspha driver",

  description: "",

  inputs: {
    vendor: {
      type: "ref",
      required: true,
      description: "logged in vendor",
    },
    order_id: {
      type: "number",
      required: true,
    },
    vehicle_id: {
      type: "number",
      required: true,
    },
  },

  exits: {
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("action vendor/assign-waspha-driver started");
    const strings = sails.config.strings[inputs.vendor.language];

    try {
      let assigned = await sails.helpers.assignDriverToOrder(
        inputs.order_id,
        inputs.vehicle_id,
        inputs.vendor
      );
      if (assigned) {
        return exits.success({
          status: true,
          message: strings.ASSIGNED_TO_DRIVER,
          data: assigned,
        });
      }
      return exits.ok({
        status: false,
        message: strings.UNABLE_TO_ASSIGN_DRIVER,
      });
    } catch (err) {
      sails.log.error(`Error in action vendor/assign-waspha-driver. ${err}`);
      return exits.ok({
        status: false,
        message: strings.UNABLE_TO_ASSIGN_DRIVER,
      });
    }
  },
};
