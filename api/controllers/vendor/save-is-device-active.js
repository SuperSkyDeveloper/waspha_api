module.exports = {
  friendlyName: "Save is device active",

  description: "",

  inputs: {
    vendor: {
      type: "ref",
      required: true,
      description: "logged in vendor",
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
    try {
      sails.log("action vendor/save-is-device-active started");
      await Vendor.updateOne({ id: inputs.vendor.id }).set({
        is_device_active: inputs.is_device_active,
      });
      sails.log("action vendor/save-is-device-active ended");
      return exits.success({
        status: true,
        message: "",
      });
    } catch (err) {
      sails.log.error(`Error in action vendor/is-device-active. ${err}`);
      return exits.ok({
        status: false,
        message: "",
      });
    }
  },
};
