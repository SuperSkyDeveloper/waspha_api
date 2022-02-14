const moment = require("moment");
module.exports = {
  friendlyName: "Verify payment",

  description: "",

  inputs: {},

  exits: {},

  fn: async function (inputs, exits) {
    sails.log("calling action user/verify-payment");
    const statuses = await sails.helpers.getAllStatuses();
    let req = this.req;
    sails.log({
      reqInVerifyPayment: req.body,
      inputs: inputs,
    });

    let success = false;
    let result = null;
    sails.log({ bodyInVerifyPayment: req.body, req: req });

    if (
      !_.isUndefined(req.body) &&
      !_.isUndefined(req.body.payment_reference)
    ) {
      result = await sails.helpers.paytabs.verifyPayment(
        req.body.payment_reference
      );
      if (!_.isUndefined(result.response_code) && result.response_code == 100) {
        success = true;
        let proposal = await Proposal.findOne({
          id: parseInt(result.reference_no),
        }).populate("rfp_store_id");
        ///
        var order_status = {
          proposal_id: proposal.id,
          order_accepted: moment().format("YYYY-MM-DD HH:mm:ss"),
        };
        await Order_status.updateOne({ proposal_id: proposal.id }).set(
          order_status
        );
        await Request_for_proposal.updateOne({
          id: proposal.rfp_store_id.rfp_id,
        }).set({ status_id: statuses.upcoming });
        await Proposal.updateOne({ id: proposal.id }).set({
          status_id: statuses.accepted,
          payment_method: global.PAYMENT_METHOD.CARD,
          payment_reference: req.body.payment_reference,
        });
        let title = "Proposal Accepted";
        let body = "Your proposal has been accepted";
        extra_data = JSON.stringify({ id: proposal.id || null });
        let vendor = await sails.helpers.getVendorOfOrder(
          proposal.id,
          "proposal"
        );
        await sails.helpers.sendPushNotification(
          vendor.id,
          global.ROLE.VENDOR,
          title,
          body,
          false,
          extra_data,
          sails.config.notification.type.PROPOSAL_ACCEPTED
        );
        await sails.helpers.general.addNotification(
          vendor.id,
          global.ROLE.VENDOR,
          title,
          body,
          extra_data,
          sails.config.notification.type.PROPOSAL_ACCEPTED
        );
        ///
      }
    }
    sails.log({ body: req.body, success: success, result: result });

    return this.res.view("pages/payment-verification", { success: success });
  },
};
