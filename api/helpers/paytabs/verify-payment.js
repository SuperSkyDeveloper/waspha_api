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

    let header = {
      authorization: sails.config.paytabs.server_key,
      "content-type": "application/json",
    };
    let postfields = {
      profile_id: sails.config.paytabs.profile_id,
      tran_ref: inputs.payment_reference,
    };
    let url = "https://secure-egypt.paytabs.com/payment/query";
    let res = await sails.helpers.request.invoke(
      url,
      "POST",
      postfields,
      header
    );
    // if (!_.isUndefined(res.body.redirect_url)) {
    //   paypage_url = res.body.redirect_url;
    //   await Proposal.updateOne({
    //     id: inputs.payment_object.reference_no,
    //   }).set({ payment_reference: res.body.tran_ref });
    // }
    console.log({
      resInVerifyPayment: res,
      payment_result: res.body.payment_result,
      payment_info: res.body.payment_info,
    });
    return exits.success(res);
  },
};
