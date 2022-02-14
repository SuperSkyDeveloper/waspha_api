module.exports = {
  friendlyName: "Calculate credit debit driver",

  description: "",

  inputs: {
    order_id: {
      type: "number",
      required: true,
    },
    driver_id: {
      type: "number",
      required: true,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("helper driver/calculate-credit-debit start");
    try {
      let order = await Proposal.findOne({ id: inputs.order_id }).populate(
        "items"
      );
      let driver = await Driver.findOne({ id: inputs.driver_id });

      let commission = null;

      if (driver.delivery_mode == 3) {
        commission = await sails.helpers.driver.getCommissionObject(driver.id);
      } else {
        commission = {
          waspha_fee_normal: 0,
          waspha_fee_normal_type: "fixed",
          waspha_fee_traditional: 0,
          waspha_fee_traditional_type: "fixed",
        };
      }

      let subtotal =
        order.order_type == global.ORDER_TYPE.TRADITIONAL
          ? order.package_charges
          : await sails.helpers.getSubtotal(order.items); //debit
      let delivery_fee = order.delivery_fee; // credit
      let commission_on_delivery_fee = 0; // debit
      let waspha_fee =
        order.order_type == global.ORDER_TYPE.NORMAL
          ? commission.waspha_fee_normal
          : commission.waspha_fee_traditional;
      let waspha_fee_type =
        order.order_type == global.ORDER_TYPE.NORMAL
          ? commission.waspha_fee_normal_type
          : commission.waspha_fee_traditional_type;
      let abc = (delivery_fee * waspha_fee) / 100;
      commission_on_delivery_fee =
        waspha_fee_type == "fixed"
          ? waspha_fee
          : (delivery_fee * waspha_fee) / 100;
      commission_on_delivery_fee = await sails.helpers.fixDoubleValue(
        commission_on_delivery_fee,
        2
      );

      let promo_code_discount = 0; //debit,in minus if promo_code is_requested= false,in plus if is_requested = true

      if (order.promo_code_id) {
        pm_result = await sails.helpers.calculatePromoCodeDiscount(
          order.promo_code_id,
          {
            subtotal: subtotal,
            total: subtotal + delivery_fee + commission_on_delivery_fee,
            waspha_fee: commission_on_delivery_fee,
            delivery_fee: delivery_fee,
          }
        );

        promo_code_discount =
          pm_result.promo_code.is_requested == false
            ? -pm_result.discount
            : pm_result.discount;
      }
      let credit = delivery_fee - commission_on_delivery_fee;
      let debit = subtotal + commission_on_delivery_fee + promo_code_discount;
      let total_earning = credit;

      if (
        order.payment_method == global.PAYMENT_METHOD.CARD ||
        order.payment_method == global.PAYMENT_METHOD.WALLET
      ) {
        if (driver.type == global.DRIVER_TYPE.WASPHA_EXPRESS) {
          credit = total_earning;
          debit = 0;
        } else {
          credit = 0;
          debit = 0;
        }
      } else if (
        order.payment_method == global.PAYMENT_METHOD.CASH_ON_DELIVERY
      ) {
        if (driver.type == global.DRIVER_TYPE.WASPHA_EXPRESS) {
          credit = 0;
        } else {
          credit = 0;
          debit = 0;
        }
      }

      let to_update = {};
      if (order.credit_amount !== credit) {
        to_update.credit_amount = credit;
      }
      if (order.debit_amount !== debit) {
        to_update.debit_amount = debit;
      }
      if (order.total_earning !== total_earning) {
        to_update.total_earning = total_earning;
      }
      if (!_.isEmpty(to_update)) {
        //await Proposal.updateOne({ id: order.id }).set(to_update);
      }
      sails.log("helper calculate-credit-debit end");
      return exits.success({
        credit: await sails.helpers.fixDoubleValue(credit),
        debit: await sails.helpers.fixDoubleValue(debit),
        total_earning: await sails.helpers.fixDoubleValue(total_earning),
        to_update: to_update,
      });
    } catch (err) {
      sails.log(`Error in helper calculate-credit-debit. ${err}`);
      return exits.success({});
    }
  },
};
