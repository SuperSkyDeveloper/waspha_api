module.exports = {
  friendlyName: "Get setting",

  description: "",

  inputs: {
    key: {
      type: "json",
      required: true,
    },
  },

  exits: {
    success: {
      outputFriendlyName: "Setting",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper get-setting");
    let setting = null;
    try {
      setting = await Setting.find({ key: inputs.key });
      return exits.success(setting);
    } catch (err) {
      sails.log.error(`Error in helper get-setting. ${err}`);
      return exits.success(null);
    }
  },
};
