module.exports = {
  friendlyName: "Get proposal description driver",

  description: "",

  inputs: {
    proposal: {
      type: "ref",
      required: true,
    },
    language: {
      type: "string",
      required: false,
      defaultsTo: "en",
    },
  },

  exits: {
    success: {
      outputFriendlyName: "Proposal description",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper get-proposal-desription");
    sails.log({ proposal: inputs.proposal });
    let language = inputs.language;
    let key = `PROPOSAL_DESCRIPTION_${inputs.proposal.type.toUpperCase()}`;
    if ([global.STATUS.COMPLETED].includes(inputs.proposal.status)) {
      key = `PROPOSAL_PAST_DESCRIPTION_${inputs.proposal.type.toUpperCase()}`;
    }
    let translation = await Waspha_translation_all.find({ key: key });
    translation = translation[0];

    if (inputs.proposal.order_type == global.ORDER_TYPE.TRADITIONAL) {
      inputs.proposal.delivery_location = JSON.parse(
        inputs.proposal.delivery_location
      );
      inputs.proposal.delivery_location =
        inputs.proposal.delivery_location.address;
    }

    var translated_title = {
      en: "",
      ar: "",
    };

    var items = await Proposal_item.find({
      where: { proposal_id: inputs.proposal.proposal_id },
      select: ["title"],
    }).populate("product_id");

    for (item of items) {
      title = item.title;
      if (item.product_id) {
        title = item.product_id.title || item.product_id.title_ar;
      }
      translated_title.en += title + ", ";
      translated_title.ar += title + ", ";
    }
    translated_title.en = translated_title.en.replace(/,\s*$/, "");
    translated_title.ar = translated_title.ar.replace(/,\s*$/, "");

    translated_description = translation[language]
      .replace("{user}", inputs.proposal.user_name || "user")
      .replace("{delivery_location}", inputs.proposal.delivery_location)
      .replace("{item_names}", translated_title[language]);
    return exits.success(translated_description);
  },
};
