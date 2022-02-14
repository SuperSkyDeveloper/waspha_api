module.exports = {
  friendlyName: "Get delivery vehicle charge",

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
    sails.log("calling action super-admin/get-cancellation-reason");
    try {
      let req = this.req;
      let where = { country: inputs.id };
      let delivery_vehicle_charges = await Delivery_vehicle_charge.find({
        where: where,
        select: ["id", "base_fee", "fee_per_minute", "fee_per_km"],
      })
        .populate("country")
        .populate("delivery_vehicle");

      if (delivery_vehicle_charges.length) {
        let response_obj = {
          id: delivery_vehicle_charges[0].country.id,
          country: delivery_vehicle_charges[0].country.en,
          charges: [],
        };

        for (obj of delivery_vehicle_charges) {
          let temp2 = {};
          temp2.id = obj.id;
          temp2.delivery_vehicle = obj.delivery_vehicle.display_name;
          temp2.base_fee = obj.base_fee;
          temp2.fee_per_km = obj.fee_per_km;
          temp2.fee_per_minute = obj.fee_per_minute;
          response_obj.charges.push(temp2);
        }

        return exits.success({
          status: true,
          data: response_obj,
        });
      }
    } catch (err) {
      sails.log.error(
        `Error in action super-admin/get-cancellation-reasons.${err}`
      );
      return exits.ok({
        status: false,
      });
    }
  },
};
