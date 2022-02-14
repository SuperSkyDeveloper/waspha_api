module.exports = {
  friendlyName: "Is json string",

  description: "",

  inputs: {
    str: { type: "string", required: true },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    try {
      JSON.parse(inputs.str);
    } catch (e) {
      return exits.success(false);
    }
    return exits.success(true);
  },
};
