const paytabs = require("paytabs_api");
module.exports = {
  friendlyName: "Verify payment",

  description: "",

  inputs: {},

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper paytabs/validate-secret-key");
    /**
     * Please check this Paytabs API for more information
     * https://dev.paytabs.com/docs/paypage.html#verify-payment
     */

    ///
    paytabs.validateSecretKey(
      {
        merchant_email: sails.config.paytabs.merchant_email,
        secret_key: sails.config.paytabs.secret_key,
      },
      validateSecretKey
    );

    function validateSecretKey(result) {
      if (result.response_code == 4000) {
        //Valid
        console.log(result);
      } else {
        //Failed
        console.log({ error: result });
      }

      return exits.success(result);
    }
  },
};
