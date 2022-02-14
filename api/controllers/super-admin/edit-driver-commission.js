module.exports = {
  friendlyName: "Edit driver commission",

  description: "",

  inputs: {},

  exits: {},

  fn: async function (inputs) {
    // All done.
    return;
  },
};

const moment = require("moment");
module.exports = {
  friendlyName: "Edit driver commission",

  description: "",

  inputs: {
    id: {
      type: "number",
      required: true,
    },
    country: {
      type: "ref",
      required: true,
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
    sails.log("calling action super-admin/edit-commission");
    let exist = await Waspha_commission_driver.findOne({ id: inputs.id });
    if (!exist) {
      return exits.ok({
        status: false,
        data: [],
        message: "Invalid id",
      });
    }

    exist = await Waspha_commission_driver.find({
      country: inputs.country.id,
      and: [{ country: inputs.country.id }, { id: { "!=": inputs.id } }],
    }).limit(1);
    if (exist.length) {
      return exits.invalidRequest({
        status: false,
        message: "commission already exist for selected country",
        data: null,
      });
    }
    let rec = {};

    rec.country = inputs.country.id;
    rec.waspha_fee_normal = inputs.waspha_fee_normal;
    rec.waspha_fee_normal_type = inputs.waspha_fee_normal_type;
    rec.waspha_fee_traditional = inputs.waspha_fee_traditional;
    rec.waspha_fee_traditional_type = inputs.waspha_fee_traditional_type;

    try {
      let commission = await Waspha_commission_driver.updateOne({
        id: inputs.id,
      }).set(rec);
      sails.log({ commission: commission });
      return exits.success({
        status: true,
        message: "Updated successfully",
        data: commission,
      });
    } catch (err) {
      sails.log(`Error in action super-admin/edit-commission. ${err}`);
      return exits.ok({
        status: false,
        message: "Unable to updateSSSS",
      });
    }
  },
};
