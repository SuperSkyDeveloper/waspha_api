const moment = require("moment");
const uuidv1 = require("uuid/v1");
const crypto = require("crypto");

module.exports = {
  friendlyName: "Token",

  description: "Token realtime.",

  inputs: {
    userId: {
      type: "number",
      required: true,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    const userId = inputs.userId;
    const expiryTime = moment().add(1, "hours").toISOString();
    // const expiryTime = moment().add(2, 'minutes').toISOString();
    const rawToken =
      uuidv1() + "$" + expiryTime + "$" + userId + "$" + uuidv1();

    const cipher = crypto.createCipher("aes-256-cbc", "d6F3Efeq");
    let crypted = cipher.update(rawToken, "utf8", "hex");
    crypted += cipher.final("hex");

    return exits.success(crypted);
  },
};
