module.exports = {
  friendlyName: "Edit delivery vehicle charge",

  description: "",

  inputs: {
    id: {
      type: "number",
      required: true,
    },
    base_fee: {
      type: "number",
      required: true,
    },
    fee_per_km: {
      type: "number",
      required: true,
    },
    fee_per_minute: {
      type: "number",
      required: true,
    },
  },

  exits: {
    serverError: {
      description: "send server error",
      responseType: "serverError",
    },
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action admin/edit-delivery-vehicle-charge");
    sails.log({ inputs: inputs });
    const rec = {
      base_fee: inputs.base_fee,
      fee_per_km: inputs.fee_per_km,
      fee_per_minute: inputs.fee_per_minute,
    };
    let found = await Delivery_vehicle_charge.find({
      where: { id: inputs.id },
    }).limit(1);

    if (!found.length) {
      return exits.ok({
        status: false,
        message: `Invalid id`,
        data: [],
      });
    }

    const charge = await Delivery_vehicle_charge.updateOne({
      id: inputs.id,
    }).set(rec);

    if (charge) {
      return exits.success({
        status: true,
        message: `charges updated successfully`,
        data: charge,
      });
    }

    return exits.ok({
      status: false,
      message: `Unable to update charges`,
      data: [],
    });
  },
};
