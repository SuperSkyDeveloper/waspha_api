const { strings } = require("../../../config/strings");

module.exports = {
  friendlyName: "Is order assigned",

  description: "",

  inputs: {
    vendor: {
      type: "ref",
      required: true,
      description: "logged in vendor",
    },
    id: {
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
    sails.log(`action vendor/is-order-assigned`);
    const strings = sails.config.strings[inputs.vendor.language];
    try {
      const statuses = await sails.helpers.getAllStatuses([
        global.STATUS.DELETED,
        global.STATUS.CANCELLED,
        global.STATUS.REJECTED,
        global.STATUS.EXPIRED,
        global.STATUS.PAYMENT_RECEIVED,
      ]);
      let status_ids = Object.values(statuses);

      let assigned = await Proposal_driver.find({
        proposal_id: inputs.id,
        status_id: { "!=": status_ids },
      }).limit(1);
      return exits.success({
        status: true,
        message: strings.FOUND,
        data: { is_assigned: assigned.length > 0 },
      });
    } catch (err) {
      sails.log.error(`Error in action vendor/is-order-assigned . ${err}`);
      return exits.success({
        status: false,
        message: strings.UNABLE_TO_PROCESS,
      });
    }
  },
};
