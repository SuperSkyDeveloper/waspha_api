const paytabs = require("paytabs_api");
module.exports = {
  friendlyName: "Verify payment",

  description: "",

  inputs: {
    payment_reference: {
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
    sails.log("calling helper paytabs/verify-payment");
    /**
     * Please check this Paytabs API for more information
     * https://dev.paytabs.com/docs/paypage.html#verify-payment
     */
    paytabs.verifyPayment(
      {
        merchant_email: sails.config.paytabs.merchant_email,
        secret_key: sails.config.paytabs.secret_key,
        payment_reference: inputs.payment_reference,
      },
      verifyPayment
    );

    function verifyPayment(result) {
      return exits.success(result);
    }
  },
};
