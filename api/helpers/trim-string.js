String.prototype.trimLeft = function (charlist) {
  if (charlist === undefined) charlist = "s";

  return this.replace(new RegExp("^[" + charlist + "]+"), "");
};
String.prototype.trimRight = function (charlist) {
  if (charlist === undefined) charlist = "s";

  return this.replace(new RegExp("[" + charlist + "]+$"), "");
};
module.exports = {
  friendlyName: "Trim string",

  description: "",

  inputs: {
    str: {
      type: "string",
      required: true,
    },
    char_list: {
      type: "string",
      required: true,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper trim-string");

    return exits.success(
      inputs.str.trimLeft(inputs.char_list).trimRight(inputs.char_list)
    );
  },
};
