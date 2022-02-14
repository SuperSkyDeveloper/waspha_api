const jwt = require("jsonwebtoken");

const jwtToken = {
  access_token: sails.config.jwt.access_token,
  refresh_token: sails.config.jwt.refresh_token,
};

const expireTime = process.env.TOKEN_EXPIRATION;

module.exports = {
  friendlyName: "Access token",

  description: "",

  inputs: {
    payload: {
      type: "ref",
      required: true,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function ({ payload }, exits) {
    console.log("expirein:", process.env.TOKEN_EXPIRATION);
    return exits.success(
      jwt.sign(payload, jwtToken.access_token, { expiresIn: expireTime })
    );
  },
};
