module.exports = {
  friendlyName: "Get country delivery vehicle charges",

  description: "",

  inputs: {
    country_id: {
      type: "number",
      required: true,
    },
  },

  exits: {
    success: {
      outputFriendlyName: "Country delivery vehicle charges",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("helper get-country-delivery-vehicle-charges started");
    let charges = [];
    try {
      let where = {};
      where.country = inputs.country_id;
      charges = await sails.models["delivery_vehicle_charge"].find(where);
    } catch (err) {
      sails.log.error(
        `Error in helper get-country-delivery-vehicle-charges. ${err}`
      );
    }
    sails.log("helper get-country-delivery-vehicle-charges ended");
    return exits.success(charges);
  },
};
