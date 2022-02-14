module.exports = {
  friendlyName: "Test view",

  description: "",

  inputs: {},

  exits: {},
  fn: async function (inputs) {
    // return this.res.send(
    //   <script>window.ReactNativeWebView.postMessage("paymentSuccess");</script>
    // );
    let res = this.res;
    sails.log({ res });
    return res.view("pages/payment-verification", { success: true });
  },
};
