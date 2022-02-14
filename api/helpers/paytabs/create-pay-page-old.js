//const paytabs = require("paytabs");
const paytabs = require("paytabs_api");

module.exports = {
  friendlyName: "Create pay page",

  description: "",

  inputs: {
    payment_object: {
      type: "ref",
      required: true,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper create-pay-page");

    sails.log({ payment_object: inputs.payment_object });

    paytabs.createPayPage(inputs.payment_object, createPayPage);
    function createPayPage(result) {
      if (result.response_code == 4012) {
        //Redirect your merchant to the payment link
        console.log({ result: result });
      } else {
        //Handle the error
        console.log({ error: result });
      }
      return exits.success(result);
    }
  },
};
