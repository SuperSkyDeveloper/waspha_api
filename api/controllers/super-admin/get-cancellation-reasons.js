module.exports = {
  friendlyName: "Get cancellation reasons",

  description: "",

  inputs: {},

  exits: {
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action super-admin/get-cancellation-reasons");
    try {
      let reasons = await Setting.find({
        key: { contains: "reason" },
      }).populate("options");

      reasons[0].total = reasons.length;
      return exits.success({
        status: true,
        data: reasons,
      });
    } catch (err) {
      sails.log.error(
        `Error in action super-admin/get-cancellation-reasons.${err}`
      );
      return exits.ok({
        status: false,
      });
    }
  },
};
