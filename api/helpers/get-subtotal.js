module.exports = {
  friendlyName: "Get subtotal",

  description: "",

  inputs: {
    items: {
      type: "ref",
      required: true,
    },
  },

  exits: {
    success: {
      outputFriendlyName: "Subtotal",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("helper get-subtotal start");
    let items = inputs.items;
    let menu_promotions = await sails.helpers.getMenuPromotions();
    let subtotal = 0;
    for (item of items) {
      let tax = (item.price * item.tax_ratio) / 100;
      let promotionTotal = 0;
      sails.log({ item: item.product_id });
      if (item.product_id) {
        item.menu_promotion = await sails.helpers.getMenuPromotion(
          item.product_id,
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
      }
      item_total = item.price * item.quantity + tax - promotionTotal;
      subtotal += item_total;
    }
    sails.log("helper get-subtotal end");
    return exits.success(subtotal);
  },
};
