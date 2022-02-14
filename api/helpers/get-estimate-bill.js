module.exports = {
  friendlyName: "Get estimate bill",

  description: "",

  inputs: {
    items: {
      type: "ref",
      required: true,
    },
    waspha_fee: {
      type: "number",
      required: false,
      defaultsTo: 5,
    },
    waspha_fee_type: {
      type: "string",
      required: false,
      defaultsTo: "percentage",
    },
    package_charges: {
      type: "number",
      required: false,
      allowNull: true,
      description: "It will be provided if order_type is tradtional",
    },
  },

  exits: {
    success: {
      outputFriendlyName: "Estimate bill",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper get-estimate-bill");
    let data = { sum: sum, total: 0 };
    try {
      var sum = 0;
      let menu_promotions = await sails.helpers.getMenuPromotions();
      var wasphaFee = inputs.waspha_fee; //will be set from admin panel later
      var wasphaFeeType = inputs.waspha_fee_type;
      var subtotal = 0;
      var discounted_subtotal = 0;
      for (item of inputs.items) {
        var tax = ((item.price * item.tax_ratio) / 100) * item.quantity;

        sum = item.price * item.quantity + tax;

        ////
        let promotionTotal = 0;
        if (item.product_id) {
          item.menu_promotion = await sails.helpers.getMenuPromotion(
            item.product_id.id,
            menu_promotions
          );
          if (item.menu_promotion) {
            if (
              !_.isUndefined(item.menu_promotion.extra_data) &&
              !_.isEmpty(item.menu_promotion.extra_data) &&
              !_.isUndefined(item.menu_promotion.extra_data.discount)
            ) {
              let ratioAmount =
                (item.price * item.menu_promotion.extra_data.discount) / 100;
              promotionTotal = ratioAmount * item.quantity;
            }
          }
          item.product_id = item.product_id.id;
        }
        subtotal += sum;
        discounted_subtotal += sum - promotionTotal;
        ////
      }
      var wasphaFeeAmount = wasphaFee;
      if (wasphaFeeType == "percentage") {
        wasphaFeeAmount = (subtotal * wasphaFee) / 100;
      }
      data = {
        sum: sum || inputs.package_charges,
        total: discounted_subtotal + wasphaFeeAmount || inputs.package_charges,
        waspha_fee_amount: wasphaFeeAmount,
        subtotal: discounted_subtotal || inputs.package_charges,
      };
      // sails.log({
      //   dataEst: data,
      //   wasphaFeeAmount: wasphaFeeAmount,
      //   subtotal: subtotal,
      // });
      return exits.success(data);
    } catch (err) {
      sails.log(`Error in helper get-estimate-bill. ${err}`);
      return exits.success(data);
    }
  },
};
