module.exports = {
  friendlyName: "Get cancellation reason",

  description: "",

  inputs: {
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
    sails.log("calling action super-admin/get-cancellation-reason");
    try {
      let req = this.req;
      if (req.query.filter) {
        let filter = JSON.parse(req.query.filter);
        if (filter.category_id) {
        }
      }
      let reason = await Setting.findOne({ id: inputs.id }).populate("options");

      return exits.success({
        status: true,
        data: reason,
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
