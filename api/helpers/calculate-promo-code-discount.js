module.exports = {
  friendlyName: "Calculate promo code discount",

  description: "",

  inputs: {
    promo_code_id: {
      type: "number",
      required: true,
    },
    order: {
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
    sails.log("calling helper calculate-promo-code-discount");
    try {
      let promo_code = await Promo_code.findOne({ id: inputs.promo_code_id });
      let order = inputs.order;
      let amount = 0;
      switch (promo_code.apply_on) {
        case global.PROMO_APPLY_ON.SUBTOTAL: {
          amount = order.subtotal;
          break;
        }
        case global.PROMO_APPLY_ON.TOTAL: {
          amount = order.total;
          break;
        }
        case global.PROMO_APPLY_ON.WASPHA_FEE: {
          amount = order.waspha_fee;
          break;
        }
        case global.PROMO_APPLY_ON.DELIVERY_FEE: {
          amount = order.delivery_fee;
          break;
        }
      }
      let discount =
        promo_code.discount_type == "fixed"
          ? promo_code.discount
          : (amount * promo_code.discount) / 100;

      if (promo_code.max_discount && promo_code.max_discount < discount) {
        discount = promo_code.max_discount;
      }
      return exits.success({
        promo_code: promo_code,
        discount: discount,
      });
    } catch (err) {}
  },
};
