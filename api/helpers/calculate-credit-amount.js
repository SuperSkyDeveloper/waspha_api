module.exports = {
  friendlyName: "Calculate credit amount",

  description: "",

  inputs: {
    order_type: {
      type: "string",
      required: true,
    },
    total_earning: {
      type: "number",
      required: true,
    },
    delivery_fee: {
      type: "number",
      required: false,
      allowNull: true,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper calculate-credit-amount");
    let setting = await sails.helpers.getSetting([
      "waspha_fee_delivery",
      "waspha_fee_delivery_type",
      "waspha_fee_pickup",
      "waspha_fee_pickup_type",
    ]);
    order_type = inputs.order_type;
    total_earning = inputs.total_earning;
    delivery_fee = inputs.delivery_fee;
    const waspha_fee_on_delivery = parseFloat(
      _.find(setting, {
        key: "waspha_fee_delivery",
      }).value
    ); //percenatage,will be fetched from database later
    waspha_fee_type_delivery = _.find(setting, {
      key: "waspha_fee_delivery_type",
    }).value;
    const waspha_fee_on_pickup = parseFloat(
      _.find(setting, {
        key: "waspha_fee_pickup",
      }).value
    ); //percenatage,will be fetched from database later
    waspha_fee_type_pickup = _.find(setting, {
      key: "waspha_fee_pickup_type",
    }).value;
    const applied_fee =
      order_type === global.RFP_TYPE.DELIVERY
        ? waspha_fee_on_delivery
        : waspha_fee_on_pickup;
    delivery_fee = order_type === global.RFP_TYPE.DELIVERY ? delivery_fee : 0;

    let credit_amount = applied_fee;
    if (
      order_type === global.RFP_TYPE.DELIVERY &&
      waspha_fee_type_delivery == "percentage"
    ) {
      credit_amount = (total_earning * applied_fee) / 100;
    } else if (
      order_type === global.RFP_TYPE.PICKUP &&
      waspha_fee_type_pickup == "percentage"
    ) {
      credit_amount = (total_earning * applied_fee) / 100;
    }

    return exits.success(credit_amount + delivery_fee);
  },
};
