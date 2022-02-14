module.exports = {
  friendlyName: "Cancel order",

  description: "",

  inputs: {
    vendor: {
      type: "ref",
      required: true,
      description: "logged in vendor",
    },
    order_id: {
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
    sails.log("action vendor/assign-waspha-driver started");
    const strings = sails.config.strings[inputs.vendor.language];
    try {
      let order = await Proposal.findOne({ id: inputs.order_id });
      if (!order) {
        return exits.ok({
          status: false,
          message: strings.INVALID_ORDER_ID,
        });
      }
      const statuses = await sails.helpers.getAllStatuses();
      await Proposal.updateOne({ id: order.id }).set({
        status_id: statuses[global.STATUS.CANCELLED],
      });
      return exits.success({
        status: true,
        message: strings.CANCELLED_SUCCESSFULLY,
      });
    } catch (err) {
      sails.log.error(`Error in action vendor/cancel-order. ${err}`);
      return exits.ok({
        status: false,
        message: strings.UNABLE_TO_PROCESS,
      });
    }
  },
};
