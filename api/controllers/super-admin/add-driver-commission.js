const moment = require("moment");
module.exports = {
  friendlyName: "Add driver commission",

  description: "",

  inputs: {
    country: {
      type: "number",
      required: false,
    },
    waspha_fee_normal: {
      type: "number",
      required: true,
    },
    waspha_fee_normal_type: {
      type: "string",
      required: true,
      isIn: ["percentage", "fixed"],
    },
    waspha_fee_traditional: {
      type: "number",
      required: true,
    },
    waspha_fee_traditional_type: {
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

    let exist = await Waspha_commission_driver.find({
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
    rec.waspha_fee_normal = inputs.waspha_fee_normal;
    rec.waspha_fee_normal_type = inputs.waspha_fee_normal_type;
    rec.waspha_fee_traditional = inputs.waspha_fee_traditional;
    rec.waspha_fee_traditional_type = inputs.waspha_fee_traditional_type;
    try {
      let commission = await Waspha_commission_driver.create(rec).fetch();

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
