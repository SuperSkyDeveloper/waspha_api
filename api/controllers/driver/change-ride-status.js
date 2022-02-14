const moment = require("moment");

// async function updateStoreCreditDebit(proposal_id, store_id) {
//   let credit_debit = await sails.helpers.vendor.calculateCreditDebit(
//     proposal_id
//   );

//   let store = await Store.findOne({
//     where: { id: store_id },
//     select: ["credit_amount", "debit_amount"],
//   });
//   await Store.updateOne({ id: store.id }).set({
//     credit_amount: store.credit_amount + credit_debit.credit,
//     debit_amount: store.debit_amount + credit_debit.debit,
//   });
// }
module.exports = {
  friendlyName: "Change ride status",

  description: "",

  inputs: {
    driver: {
      type: "ref",
      required: true,
      description: "logged in driver",
    },
    request_id: {
      type: "number",
      required: true,
    },
    status: {
      type: "string",
      required: true,
      isIn: [
        "at_pickup",
        "picked_up",
        "delivery_started",
        "at_delivery",
        "delivery_confirmed",
        "payment_received",
      ],
    },
    code: {
      type: "number",
      required: false,
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
    sails.log("calling action driver/change-ride-status");
    const statuses = await sails.helpers.getAllStatuses();
    let template = await sails.helpers.getNotificationTemplate(
      sails.config.notification.type.ORDER_COMPLETED
    );

    try {
      var ride = await Proposal_driver.findOne({
        id: inputs.request_id,
        driver_id: inputs.driver.id,
      }).populate("proposal_id");
      if (!ride) {
        return exits.ok({
          status: false,
          message:
            sails.config.strings[inputs.driver.language]
              .INVALID_ORDER_REQUEST_ID,
          data: [],
        });
      }
      let order_info = await sails.helpers.fetchOrderInfoForNotification(
        ride.proposal_id.id,
        ride.proposal_id.order_type
      );

      let key =
        order_info.type == global.RFP_TYPE.DELIVERY
          ? "waspha_fee_delivery"
          : "waspha_fee_pickup";
      let setting = await sails.helpers.getSetting(key);
      let wasphaFee = 5;
      let wasphaFeeType = "percentage";
      if (setting.length) {
        wasphaFee = parseFloat(setting[0].value);
        let setting_type = await sails.helpers.getSetting(key + "_type");
        wasphaFeeType = setting_type[0].value;
      }

      let estimate_bill = await sails.helpers.getEstimateBill(
        await Proposal_item.find({ proposal_id: ride.proposal_id.id }).populate(
          "product_id"
        ),
        wasphaFee,
        wasphaFeeType
      );
      if (order_info.type == global.RFP_TYPE.DELIVERY) {
        estimate_bill.total += order_info.delivery_fee;
      }

      //return exits.success();
      var ride_status = inputs.status;
      var status_id = null;
      var proposal_status = null;
      var order_status = {};
      let loyalty_points_user = null;
      let loyalty_points_vendor = null;

      var vendor = await sails.helpers.getVendorOfOrder(
        ride.proposal_id.id,
        "proposal",
        ride.proposal_id.order_type
      );
      var user = await sails.helpers.getUserOfOrder(
        ride.proposal_id.id,
        "proposal"
      );

      switch (ride_status) {
        case global.STATUS.AT_PICKUP: {
          if (_.isUndefined(inputs.code)) {
            return exits.ok({
              status: false,
              message:
                sails.config.strings[inputs.driver.language]
                  .VERIFICATION_CODE_REQUIRED,
              data: [],
            });
          }

          if (ride.code !== inputs.code) {
            return exits.ok({
              status: false,
              message:
                sails.config.strings[inputs.driver.language]
                  .INVALID_VERIFICATION_CODE,
              data: [],
            });
          }
          status_id = statuses.at_pickup;
          break;
        }
        case global.STATUS.PICKED_UP: {
          status_id = statuses.picked_up;
          order_status.order_picked = moment().format("YYYY-MM-DD HH:mm:ss");
          break;
        }
        case global.STATUS.DELIVERY_STARTED: {
          status_id = statuses.delivery_started;
          break;
        }
        case global.STATUS.AT_DELIVERY: {
          status_id = statuses.at_delivery;
          break;
        }
        case global.STATUS.DELIVERY_CONFIRMED: {
          status_id = statuses.delivery_confirmed;
          // proposal_status = statuses.delivered;
          order_status.order_delivered = moment().format("YYYY-MM-DD HH:mm:ss");

          if (!_.isEmpty(order_info)) {
            if (
              order_info.payment_method == global.PAYMENT_METHOD.WALLET ||
              order_info.payment_method == global.PAYMENT_METHOD.CARD
            ) {
              status_id = statuses.payment_received;
              proposal_status = statuses.completed;
              sails.log({ proposal_status11: proposal_status });

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
              });
            }
            // extra_data['type'] = order_info.type;
            // extra_data['vendor_id'] = order_info.vendor_id;
            // extra_data['user_id'] = order_info.user_id;
          }
          break;
        }
        case global.STATUS.PAYMENT_RECEIVED: {
          status_id = statuses.payment_received;
          proposal_status = statuses.completed;

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

          let extra_data = {
            proposal_id: ride.proposal_id.id,
            driver_id: inputs.driver.id,
          };
          sails.log({ order_info: order_info });
          if (!_.isEmpty(order_info)) {
            extra_data["type"] = order_info.type;
            extra_data["vendor_id"] = order_info.vendor_id;
            extra_data["user_id"] = order_info.user_id;
          }

          let title = "Order Complete";
          let body = "Order has been completed";
          //  extra_data = JSON.stringify(extra_data);
          extra_data.sent_by = {
            name: inputs.driver.name,
            avatar: inputs.driver.avatar,
          };
          await sails.helpers.general.addNotification(
            order_info.vendor_id,
            global.ROLE.VENDOR,
            title,
            body,
            JSON.stringify(extra_data),
            sails.config.notification.type.ORDER_COMPLETED
          );

          var notification_vendor = {
            id: order_info.vendor_id,
            role: global.ROLE.VENDOR,
            title: template.meta[vendor.language],
            body: template[vendor.language].replace(
              "{order_id}",
              ride.proposal_id.id
            ),
            silent: false,
            extra_data: JSON.stringify(extra_data),
            type: sails.config.notification.type.ORDER_COMPLETED,
          };

          //extra_data = JSON.stringify({'proposal_id': ride.proposal_id || null});
          delete extra_data.user_id;
          delete extra_data.vendor_id;
          extra_data.store_id = order_info.s_id;

          extra_data.sent_by = await sails.helpers.getSentBy(
            order_info.s_id,
            order_info.s_name,
            order_info.s_image
          );
          if (!_.isUndefined(user.id)) {
            var notification_user = {
              id: user.id,
              role: global.ROLE.USER,
              title: template.meta[user.language],
              body: template[user.language].replace(
                "{order_id}",
                ride.proposal_id.id
              ),
              silent: false,
              extra_data: JSON.stringify(extra_data),
              type: sails.config.notification.type.ORDER_COMPLETED,
            };
            await sails.helpers.general.addNotification(
              user.id,
              global.ROLE.USER,
              title,
              body,
              JSON.stringify(extra_data),
              sails.config.notification.type.ORDER_COMPLETED
            );
          }

          break;
        }
      } //end switch

      console.log("status_id:", status_id);
      console.log("proposal_status:", proposal_status);
      console.log("order_status:", order_status);
      // return exits.success(true);
      let updated = await Proposal_driver.updateOne({
        id: inputs.request_id,
      }).set({ status_id: status_id });
      let status = await Status.findOne({
        where: { id: status_id },
        select: ["description"],
      });
      if (proposal_status) {
        await Proposal.updateOne({ id: ride.proposal_id.id }).set({
          status_id: proposal_status,
        });
        if (proposal_status == statuses.completed) {
          await sails.helpers.updateRfpStatus(
            statuses.completed,
            ride.proposal_id.id
          );

          if (!_.isUndefined(user.id) && loyalty_points_user) {
            await sails.helpers.general.updateLoyaltyPoints(
              user.id,
              global.ROLE.USER,
              loyalty_points_user
            );
          }
          if (loyalty_points_vendor) {
            await sails.helpers.general.updateLoyaltyPoints(
              vendor.id,
              global.ROLE.VENDOR,
              loyalty_points_vendor
            );
          }
          await sails.helpers.updateStoreCreditDebit(
            ride.proposal_id.id,
            vendor.s_id
          );
          await sails.helpers.updateDriverCreditDebit(
            ride.proposal_id.id,
            inputs.driver.id
          );
        }
      }
      if (Object.keys(order_status).length > 0) {
        await Order_status.updateOne({ proposal_id: ride.proposal_id.id }).set(
          order_status
        );
      }
      if (!_.isUndefined(notification_vendor)) {
        sails.log("sending push notification to vendor & user");
        await sails.helpers.sendPushNotification(
          notification_vendor.id,
          notification_vendor.role,
          notification_vendor.title,
          notification_vendor.body,
          notification_vendor.silent,
          notification_vendor.extra_data,
          notification_vendor.type
        );
        if (
          !_.isUndefined(notification_user) &&
          !_.isUndefined(notification_user.id)
        ) {
          await sails.helpers.sendPushNotification(
            notification_user.id,
            notification_user.role,
            notification_user.title,
            notification_user.body,
            notification_user.silent,
            notification_user.extra_data,
            notification_user.type
          );
        }
      }
      return exits.success({
        status: true,
        message: sails.config.strings[inputs.driver.language].STATUS_CHANGED,
        data: { status: status.description },
      });
    } catch (err) {
      sails.log.error(
        `Error in changing ride status for order request id ${inputs.request_id}. ${err}`
      );
      return exits.ok({
        status: false,
        message:
          sails.config.strings[inputs.driver.language].UNABLE_TO_CHANGE_STATUS,
        data: [],
      });
    }
  },
};
