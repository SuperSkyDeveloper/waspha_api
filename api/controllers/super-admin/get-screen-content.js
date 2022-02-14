module.exports = {
  friendlyName: "Get screen content",

  description: "",

  inputs: {
    id: {
      type: "number",
      required: true,
    },
  },

  exits: {
    unauthorized: {
      responseType: "unauthorized",
      description: "Send 401 if authentication failed",
    },
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
    notFound: {
      description: "Send notFound response",
      responseType: "notFound",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action super-admin/get-screen-content");
    try {
      waspha_setting = await Waspha_setting.findOne({ id: inputs.id });

      if (waspha_setting) {
        return exits.success({
          status: true,
          data: waspha_setting,
        });
      }
    } catch (err) {
      sails.log.error(`Error in action super-admin/get-screen-content. ${err}`);
      return exits.notFound({
        status: false,
        data: [],
      });
    }
  },
};
