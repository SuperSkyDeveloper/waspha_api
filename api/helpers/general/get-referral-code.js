const { exists } = require("grunt");

module.exports = {
  friendlyName: "Get referral code",

  description: "",

  inputs: {
    role: {
      type: "string",
      required: true,
    },
  },

  exits: {
    success: {
      outputFriendlyName: "Referral code",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("helper general/get-referral-code started");
    try {
      let random = null;
      let found = null;
      do {
        random = await sails.helpers.generateRandomString();
        found = await sails.models[inputs.role]
          .find({ referral_code: random })
          .limit(1);
      } while (found.length);
      return exits.success(random);
    } catch (err) {
      sails.log.error(`Error in helper general/get-referral-code. ${err}`);
      return exits.success(false);
    }
  },
};
