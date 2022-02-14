const moment = require("moment");
module.exports = {
  friendlyName: "Verify payment",

  description: "",

  inputs: {
    proposal_id: {
      type: "number",
      required: true,
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    sails.log("calling action user/verify-payment");
    const statuses = await sails.helpers.getAllStatuses();
    // let req = this.req;
    // sails.log({
    //   reqInVerifyPayment: req.body,
    //   inputs: inputs,
    // });

    let success = false;
    let result = null;
    //  sails.log({ bodyInVerifyPayment: req.body, req: req });
    let proposal = await Proposal.findOne({
      where: {
        id: inputs.proposal_id,
        status_id: statuses[global.STATUS.PENDING],
      },
      select: ["payment_reference"],
    }).populate("rfp_store_id");

    if (proposal) {
      result = await sails.helpers.paytabs.verifyPayment(
        proposal.payment_reference
      );

      sails.log({ resultInUserVP: result });
      if (
        !_.isUndefined(result.body.payment_result) &&
        result.body.payment_result.response_status == "A"
      ) {
        success = true;
        // let proposal = await Proposal.findOne({
        //   id: parseInt(result.reference_no),
        // }).populate("rfp_store_id");
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
          payment_reference: result.body.tran_ref,
        });
        let title = "Proposal Accepted";
        let body = "Your proposal has been accepted";
        //extra_data = JSON.stringify({ id: proposal.id || null });
        let vendor = await sails.helpers.getVendorOfOrder(
          proposal.id,
          "proposal"
        );
        let user = await sails.helpers.getUserOfOrder(proposal.id, "proposal");
        extra_data = JSON.stringify({
          id: proposal.id || null,
          sent_by: {
            name: user.name,
            avatar: user.avatar || null,
          },
        });
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
    //sails.log({ body: req.body, success: success, result: result });

    return this.res.view("pages/payment-verification", { success: success });
  },
};
