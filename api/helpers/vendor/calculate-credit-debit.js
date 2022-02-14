module.exports = {
  friendlyName: "Calculate credit debit",

  description: "",

  inputs: {
    order_id: {
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
    sails.log("helper vendor/calculate-credit-debit start");
    try {
      let order = await Proposal.findOne({ id: inputs.order_id }).populate(
        "items"
      );

      let commission = null;
      if (order.rfp_store_id) {
        commission = await sails.helpers.getCommissionObject(
          order.rfp_store_id,
          "rfp_store"
        );
      } else {
        //no rfp ,it means this order is traditional and has no user record
        commission = {
          waspha_fee_delivery: 0,
          waspha_fee_delivery_type: "fixed",
          waspha_fee_pickup: 0,
          waspha_fee_pickup_type: "fixed",
        };
      }

      let subtotal =
        order.order_type == global.ORDER_TYPE.TRADITIONAL
          ? order.package_charges
          : await sails.helpers.getSubtotal(order.items); //credit
      let delivery_fee = order.delivery_fee; // credit
      let commission_on_subtotal = 0; // debit
      let waspha_fee =
        order.type == global.RFP_TYPE.DELIVERY
          ? commission.waspha_fee_delivery
          : commission.waspha_fee_pickup;
      let waspha_fee_type =
        order.type == global.RFP_TYPE.DELIVERY
          ? commission.waspha_fee_delivery_type
          : commission.waspha_fee_pickup_type;
      let abc = (subtotal * waspha_fee) / 100;
      commission_on_subtotal =
        waspha_fee_type == "fixed" ? waspha_fee : (subtotal * waspha_fee) / 100;
      commission_on_subtotal = await sails.helpers.fixDoubleValue(
        commission_on_subtotal,
        2
      );

      let promo_code_discount = 0; //credit,in minus if promo_code is_requested= true,in plus if is_requested = false

      if (order.promo_code_id) {
        pm_result = await sails.helpers.calculatePromoCodeDiscount(
          order.promo_code_id,
          {
            subtotal: subtotal,
            total: subtotal + delivery_fee + commission_on_subtotal,
            waspha_fee: commission_on_subtotal,
            delivery_fee: delivery_fee,
          }
        );

        promo_code_discount =
          pm_result.promo_code.is_requested == true
            ? -pm_result.discount
            : pm_result.discount;
      }
      let credit = subtotal + delivery_fee + promo_code_discount;
      let debit = commission_on_subtotal;
      let total_earning = credit - debit;
      if (order.delivery_mode_id !== 3) {
        if (
          order.payment_method == global.PAYMENT_METHOD.CARD ||
          order.payment_method == global.PAYMENT_METHOD.WALLET
        ) {
          credit = total_earning;
          debit = 0;
        } else if (
          order.payment_method == global.PAYMENT_METHOD.CASH_ON_DELIVERY
        ) {
          credit = 0;
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
        await Proposal.updateOne({ id: order.id }).set(to_update);
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
