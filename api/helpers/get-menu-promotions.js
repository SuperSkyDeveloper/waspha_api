module.exports = {
  friendlyName: "Get menu promotions",

  description: "",

  inputs: {},

  exits: {
    success: {
      outputFriendlyName: "Menu promotions",
    },
  },

  fn: async function (inputs, exits) {
    let menu_promotions = await Menu_promotion.find({
      where: { deletedAt: null },
      select: [
        "product_id",
        "type",
        "description",
        "expiry_time",
        "extra_data",
      ],
    });
    return exits.success(menu_promotions);
  },
};
