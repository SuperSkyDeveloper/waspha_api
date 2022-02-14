module.exports = {
  friendlyName: "Get delivery vehicle",

  description: "",

  inputs: {
    id: {
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
    sails.log("calling action super-admin/get-delivery-vehicle");
    try {
      let where = { deletedAt: null };
      let delivery_vehicles = await Delivery_vehicle.find({
        where: where,
      });

      if (delivery_vehicles.length) {
        return exits.success({
          status: true,
          data: delivery_vehicles[0],
        });
      }
    } catch (err) {
      sails.log.error(
        `Error in action super-admin/get-delivery-vehicle.${err}`
      );
      return exits.ok({
        status: false,
      });
    }
  },
};
