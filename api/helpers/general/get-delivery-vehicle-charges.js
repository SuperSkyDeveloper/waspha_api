module.exports = {
  friendlyName: "Get delivery vehicle charges",

  description: "",

  inputs: {
    id: {
      type: "number",
      required: true,
    },
    role: {
      type: "string",
      required: true,
    },
  },

  exits: {
    success: {
      outputFriendlyName: "Delivery vehicle charges",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("helper general/get-delivery-vehicle-charges started");
    let charges = [];
    try {
      let where = {};
      where[`${inputs.role}_id`] = inputs.id;
      let country = await sails.models[`${inputs.role}_country`]
        .find(where)
        .limit(1);
      charges = await sails.helpers.getCountryDeliveryVehicleCharges(
        country[0].country_id
      );
    } catch (err) {
      sails.log.error(
        `Error in helper general/get-delivery-vehicle-charges. ${err}`
      );
    }
    sails.log("helper general/get-delivery-vehicle-charges ended");
    return exits.success(charges);
  },
};
