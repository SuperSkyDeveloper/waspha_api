module.exports = {
  friendlyName: "Get proposal items",

  description: "",

  inputs: {
    proposal_id: {
      type: "number",
      required: true,
    },
  },

  exits: {
    success: {
      outputFriendlyName: "Proposal items",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("helper get-proposal-items started");

    var items = await Proposal_item.find({
      where: { proposal_id: inputs.proposal_id },
      select: ["id", "title", "quantity", "price", "product_id"],
    }).populate("product_id");

    for (item of items) {
      if (item.product_id) {
        item.title = {
          en: item.product_id.title,
          ar: item.product_id.title_ar,
        };
        item.image = {
          en: item.product_id.image,
          ar: item.product_id.image_ar,
        };
        item.description = {
          en: item.product_id.description,
          ar: item.product_id.description_ar,
        };
        item.product_id = item.product_id.id;
      }
    }
    sails.log("helper get-proposal-items ended");
    return exits.success(items);
  },
};
