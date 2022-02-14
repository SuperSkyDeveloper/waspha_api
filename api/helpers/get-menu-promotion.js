const moment = require("moment");
module.exports = {
  friendlyName: "Get menu promotion",

  description: "",

  inputs: {
    product_id: {
      type: "number",
      required: true,
    },
    menu_promotions: {
      type: "json",
      required: false,
    },
  },

  exits: {
    success: {
      outputFriendlyName: "Menu promotion",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper get-menu-promotion");
    let data = null;
    let menu_promotions = inputs.menu_promotions;
    let menu_promotion = _.findLast(menu_promotions, {
      product_id: inputs.product_id,
    });
    if (menu_promotion) {
      let is_after = moment(menu_promotion.expiry_time).isAfter(moment());
      if (is_after) {
        if (menu_promotion.extra_data) {
          menu_promotion.extra_data = JSON.parse(menu_promotion.extra_data);
        }
        data = menu_promotion;
      }
    }
    return exits.success(data);
  },
};
