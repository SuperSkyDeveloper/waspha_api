module.exports = {
  friendlyName: "Get waspha fee",

  description: "",

  inputs: {
    id: {
      type: "number",
      required: true,
    },
    type: {
      type: "string",
      required: true,
    },
    model: {
      type: "string",
      defaultsTo: "rfp_store",
    },
  },

  exits: {
    success: {
      outputFriendlyName: "Waspha fee",
    },
  },

  fn: async function (inputs, exits) {
    let commission = await sails.helpers.getCommissionObject(
      inputs.id,
      inputs.model
    );
    let type = inputs.type;
    let data = { wasphaFee: 0, wasphaFeeType: "percentage" };
    data.wasphaFee =
      type == global.RFP_TYPE.DELIVERY
        ? commission.waspha_fee_delivery
        : commission.waspha_fee_pickup;
    data.wasphaFeeType =
      type == global.RFP_TYPE.DELIVERY
        ? commission.waspha_fee_delivery_type
        : commission.waspha_fee_pickup_type;
    return exits.success(data);
  },
};
