const Proposal_driver = require("../../models/Proposal_driver");

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
    let return_url = `${sails.config.custom.returnUrl}/user/verify-payment/${inputs.payment_object.reference_no}`;
    let paypage_url = null;
    sails.log({ payment_object: inputs.payment_object });
    let header = {
      authorization: sails.config.paytabs.server_key,
      "content-type": "application/json",
    };
    let postfields = {
      profile_id: sails.config.paytabs.profile_id,
      tran_type: "sale",
      tran_class: "ecom",
      cart_description: "Description of the items/services",
      cart_id: `ORDER#${inputs.payment_object.reference_no}`,
      cart_currency: "EGP",
      cart_amount: inputs.payment_object.amount,
      //callback: "http://localhost:1337/user/verify-payment",
      //callback: " https://91c3dcfd18be.ngrok.io/user/verify-payment",
      //return: `http://localhost:1337/user/verify-payment/${inputs.payment_object.reference_no}`,
      return: return_url,
    };
    let url = "https://secure-egypt.paytabs.com/payment/request";
    let res = await sails.helpers.request.invoke(
      url,
      "POST",
      postfields,
      header
    );
    if (!_.isUndefined(res.body.redirect_url)) {
      paypage_url = res.body.redirect_url;
      await Proposal.updateOne({
        id: inputs.payment_object.reference_no,
      }).set({ payment_reference: res.body.tran_ref });
    }
    console.log({ resInPayment: res });
    return exits.success(res);
  },
};
