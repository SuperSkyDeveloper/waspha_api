const { convert } = require("html-to-text");
module.exports = {
  friendlyName: "Convert html into text",

  description: "",

  inputs: {
    html: {
      type: "string",
      required: false,
      allowNull: true,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    let converted = convert(inputs.html, {
      wordwrap: 130,
    });
    return exits.success(converted);
  },
};
