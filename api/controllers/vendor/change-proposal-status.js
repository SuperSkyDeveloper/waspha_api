const moment = require("moment");

module.exports = {
  friendlyName: "Change proposal status",

  description: "",

  inputs: {
    vendor: {
      type: "ref",
      required: true,
      description: "logged in vendor",
    },
    proposal_id: {
      type: "number",
      required: true,
    },
    driver_id: {
      type: "number",
      required: false,
    },
    status: {
      type: "string",
      required: true,
      isIn: [global.STATUS.PREPARED, global.STATUS.COMPLETED],
    },
  },

  exits: {
    serverError: {
      description: "send server error",
      responseType: "serverError",
    },
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action vendor/change-proposal-status");
    try {
      let template = await sails.helpers.getNotificationTemplate(
        sails.config.notification.type.ORDER_COMPLETED
      );
      var query = `SELECT p.type,p.delivery_fee,rfp_store.id as rfp_store_id,p.id as proposal_id, rfp_store.rfp_id 
      FROM proposals p 
      INNER JOIN request_for_proposal_store rfp_store ON rfp_store.id = p.rfp_store_id
      WHERE rfp_store.store_id = ${inputs.vendor.store.id}
      AND p.id = ${inputs.proposal_id}
      `;
      console.log(query);
      const result = await sails.sendNativeQuery(query);
      if (!result.rows.length) {
        return exits.ok({
          status: false,
          message:
            sails.config.strings[inputs.vendor.language].INVALID_ORDER_ID,
          data: [],
        });
      }
      const statuses = await sails.helpers.getAllStatuses();
      await Proposal.updateOne({ id: inputs.proposal_id }).set({
        status_id: statuses[inputs.status],
      });

      let user = await sails.helpers.getUserOfOrder(
        inputs.proposal_id,
        "proposal"
      );

      let wasphaFeeObj = await sails.helpers.getWasphaFee(
        result.rows[0].rfp_store_id,
        result.rows[0].type
      );
      //  sails.log({ wasphaFee232323: wasphaFee });
      let estimate_bill = await sails.helpers.getEstimateBill(
        await Proposal_item.find({ proposal_id: inputs.proposal_id }).populate(
          "product_id"
        ),
        wasphaFeeObj.wasphaFee,
        wasphaFeeObj.wasphaFeeType
      );
      let loyalty_points_user = null;
      let loyalty_points_vendor = null;
      if (result.rows[0].type == global.RFP_TYPE.DELIVERY) {
        estimate_bill.total += result.rows[0].delivery_fee;
      }
      if (
        inputs.status == global.STATUS.COMPLETED &&
        !_.isUndefined(inputs.driver_id)
      ) {
        await Proposal_driver.updateOne({
          proposal_id: inputs.proposal_id,
          driver_id: inputs.driver_id,
        }).set({ status_id: statuses.payment_received });
        await Order_status.updateOne({ proposal_id: inputs.proposal_id }).set({
          order_picked: moment().format("YYYY-MM-DD HH:mm:ss"),
          order_delivered: moment().format("YYYY-MM-DD HH:mm:ss"),
        });
        await Request_for_proposal.updateOne({
          id: result.rows[0].rfp_id,
        }).set({ status_id: statuses.past });
      }
      if (inputs.status == global.STATUS.COMPLETED) {
        await sails.helpers.updateStoreCreditDebit(
          inputs.vendor.store.id,
          inputs.proposal_id
        );
        loyalty_points_user = await sails.helpers.calculateLoyaltyPoints(
          global.ROLE.USER,
          "total",
          estimate_bill.total
        );
        loyalty_points_vendor = await sails.helpers.calculateLoyaltyPoints(
          global.ROLE.VENDOR,
          "waspha_commission",
          estimate_bill.waspha_fee_amount
        );
        sails.log({
          estimate_bill: estimate_bill,
          loyalty_points_user: loyalty_points_user,
          loyalty_points_vendor: loyalty_points_vendor,
        });
        if (loyalty_points_user) {
          await sails.helpers.general.updateLoyaltyPoints(
            user.id,
            global.ROLE.USER,
            loyalty_points_user
          );
          await sails.helpers.general.updateLoyaltyPoints(
            inputs.vendor.id,
            global.ROLE.VENDOR,
            loyalty_points_vendor
          );
        }
        await sails.helpers.updateRfpStatus(
          statuses.completed,
          inputs.proposal_id
        );
        let order_info = await sails.helpers.fetchOrderInfoForNotification(
          inputs.proposal_id
        );
        sails.log({ order_info: order_info });

        let extra_data = { proposal_id: inputs.proposal_id };
        if (!_.isEmpty(order_info)) {
          extra_data["type"] = order_info.type;
          extra_data["vendor_id"] = order_info.vendor_id;
          extra_data["user_id"] = order_info.user_id;
          if (order_info.driver_id) {
            extra_data["driver_id"] = order_info.driver_id;
          }
        }
        let title = template.meta[inputs.vendor.language];
        let body = template[inputs.vendor.language].replace(
          "{order_id}",
          inputs.proposal_id
        );
        business_name = await sails.helpers.convertHtmlIntoText(
          inputs.vendor.store.business_name
        );
        extra_data.sent_by = {
          name: business_name,
          avatar: inputs.vendor.store.image,
        };

        sails.log("sending push notification to vendor");

        await sails.helpers.sendPushNotification(
          order_info.vendor_id,
          global.ROLE.VENDOR,
          title,
          body,
          false,
          JSON.stringify(extra_data),
          sails.config.notification.type.ORDER_COMPLETED
        );
        await sails.helpers.general.addNotification(
          order_info.vendor_id,
          global.ROLE.VENDOR,
          title,
          body,
          JSON.stringify(extra_data),
          sails.config.notification.type.ORDER_COMPLETED
        );

        title = template.meta[user.language];
        body = template[user.language].replace(
          "{order_id}",
          inputs.proposal_id
        );
        //   extra_data = JSON.stringify({'proposal_id': inputs.proposal_id || null})
        delete extra_data.vendor_id;
        delete extra_data.user_id;
        extra_data.store_id = order_info.s_id;

        await sails.helpers.sendPushNotification(
          user.id,
          global.ROLE.USER,
          title,
          body,
          false,
          JSON.stringify(extra_data),
          sails.config.notification.type.ORDER_COMPLETED
        );

        extra_data.sent_by = await sails.helpers.getSentBy(
          order_info.s_id,
          await sails.helpers.convertHtmlIntoText(order_info.s_name),
          order_info.s_image
        );
        await sails.helpers.general.addNotification(
          user.id,
          global.ROLE.USER,
          title,
          body,
          JSON.stringify(extra_data),
          sails.config.notification.type.ORDER_COMPLETED
        );

        let credit_debit = await sails.helpers.vendor.calculateCreditDebit(
          inputs.proposal_id
        );

        await Store.updateOne({ id: inputs.vendor.store.id }).set({
          credit_amount:
            inputs.vendor.store.credit_amount + credit_debit.credit,
          debit_amount: inputs.vendor.store.debit_amount + credit_debit.debit,
        });
      }
      if (inputs.status == global.STATUS.PREPARED) {
        await Order_status.updateOne({ proposal_id: inputs.proposal_id }).set({
          order_prepared: moment().format("YYYY-MM-DD HH:mm:ss"),
        });
      }
      return exits.success({
        status: true,
        message: sails.config.strings[inputs.vendor.language].STATUS_CHANGED,
        data: [],
      });
    } catch (err) {
      sails.log(
        `Error in changing proposal status for proposal id ${inputs.proposal_id}. ${err}`
      );
      return exits.ok({
        status: false,
        message:
          sails.config.strings[inputs.vendor.language].UNABLE_TO_CHANGE_STATUS,
        data: [],
      });
    }
  },
};
