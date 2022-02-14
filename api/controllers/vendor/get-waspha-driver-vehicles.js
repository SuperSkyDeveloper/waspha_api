module.exports = {
  friendlyName: "Get waspha driver vehicles",

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
  },

  exits: {
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("action vendor/get-waspha-driver-vehicles started");
    sails.log(
      await sails.helpers.getDistanceMatrix(
        { lat: 24.9176, lng: 67.097 },
        { lat: 25.396, lng: 68.3578 }
      )
    );
    const strings = sails.config.strings[inputs.vendor.language];
    try {
      let order = await Proposal.findOne({ id: inputs.order_id });
      if (!order) {
        return exits.ok({
          status: false,
          message: strings.INVALID_ORDER_ID,
        });
      }
      let pick;
      let vehicles = await sails.helpers.getWasphaDriverVehicles(
        inputs.order_id
      );
      sails.log("action vendor/get-waspha-driver-vehicles ended");
      if (vehicles.length) {
        for (vehicle of vehicles) {
          vehicle.price = 50;
          vehicle.eta = 40;
        }
        return exits.success({
          status: true,
          message: strings.FOUND,
          data: vehicles,
        });
      }

      return exits.ok({
        status: false,
        message: strings.NOT_FOUND,
      });
    } catch (err) {
      sails.log.error(
        `Error in action vendor/get-waspha-driver-vehicles. ${err}`
      );
      return exits.ok({
        status: false,
        message: strings.NOT_FOUND,
      });
    }
  },
};
