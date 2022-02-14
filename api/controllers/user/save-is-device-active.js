module.exports = {
  friendlyName: "Save is device active",

  description: "",

  inputs: {
    user: {
      type: "ref",
      required: true,
      description: "logged in user",
    },
    is_device_active: {
      type: "boolean",
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
    sails.log("action user/save-is-device-active started");
    try {
      await User.updateOne({ id: inputs.user.id }).set({
        is_device_active: inputs.is_device_active,
      });
      sails.log("action user/save-is-device-active ended");
      return exits.success({
        status: true,
        message: "",
      });
    } catch (err) {
      sails.log.error(`Error in action user/is-device-active. ${err}`);
      return exits.ok({
        status: false,
        message: "",
      });
    }
  },
};
