module.exports = {
  friendlyName: "Edit store attributes",

  description: "",

  inputs: {
    admin: {
      type: "ref",
      required: true,
      description: "Logged in admin",
    },
    store_id: {
      type: "number",
      required: true,
    },
    waspha_fee_delivery: {
      type: "number",
      required: true,
    },
    waspha_fee_delivery_type: {
      type: "string",
      required: true,
    },
    waspha_fee_pickup: {
      type: "number",
      required: true,
    },
    waspha_fee_pickup_type: {
      type: "string",
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
    sails.log("calling action super-admin/edit-store-attributes");
    const strings = sails.config.strings[inputs.admin.language];
    try {
      await Store.updateOne({ id: inputs.store_id }).set({
        waspha_fee_delivery: inputs.waspha_fee_delivery,
        waspha_fee_delivery_type: inputs.waspha_fee_delivery_type,
        waspha_fee_pickup: inputs.waspha_fee_pickup,
        waspha_fee_pickup_type: inputs.waspha_fee_pickup_type,
      });
      return exits.success({
        status: true,
        message: strings.UPDATED,
      });
    } catch (err) {
      sails.log.error(
        `Error in action super-admin/edit-store-attributes. ${err}`
      );
      return exits.ok({
        status: false,
        message: strings.UNABLE_TO_UPDATE,
      });
    }
  },
};
