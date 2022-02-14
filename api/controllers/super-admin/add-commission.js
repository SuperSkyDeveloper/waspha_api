const moment = require("moment");
module.exports = {
  friendlyName: "Add commission",

  description: "",

  inputs: {
    country: {
      type: "number",
      required: false,
    },
    waspha_fee_delivery: {
      type: "number",
      required: true,
    },
    waspha_fee_delivery_type: {
      type: "string",
      required: true,
      isIn: ["percentage", "fixed"],
    },
    waspha_fee_pickup: {
      type: "number",
      required: true,
    },
    waspha_fee_pickup_type: {
      type: "string",
      required: true,
      isIn: ["percentage", "fixed"],
    },
  },

  exits: {
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
    invalidRequest: {
      description: "Send invalidRequest response",
      responseType: "invalidRequest",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action super-admin/add-commission");

    let exist = await Waspha_commission.find({
      country: inputs.country,
    }).limit(1);
    if (exist.length) {
      return exits.invalidRequest({
        status: false,
        message: "commission already exist for selected country",
        data: null,
      });
    }
    let rec = {};

    rec.country = inputs.country;
    rec.waspha_fee_delivery = inputs.waspha_fee_delivery;
    rec.waspha_fee_delivery_type = inputs.waspha_fee_delivery_type;
    rec.waspha_fee_pickup = inputs.waspha_fee_pickup;
    rec.waspha_fee_pickup_type = inputs.waspha_fee_pickup_type;

    try {
      let commission = await Waspha_commission.create(rec).fetch();

      return exits.success({
        status: true,
        message: "Created successfully",
        data: commission,
      });
    } catch (err) {
      sails.log(`Error in action super-admin/add-commission. ${err}`);
      return exits.ok({
        status: false,
        message: "Unable to create",
      });
    }
  },
};
