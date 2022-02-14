module.exports = {
  friendlyName: "Get cancellation reason item",

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
    sails.log("calling action super-admin/get-cancellation-reason-item");
    try {
      let reason = await Setting_option.findOne({ id: inputs.id });

      return exits.success({
        status: true,
        data: reason,
      });
    } catch (err) {
      sails.log.error(
        `Error in action super-admin/get-cancellation-reason-item.${err}`
      );
      return exits.ok({
        status: false,
      });
    }
  },
};
