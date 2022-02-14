module.exports = {
  friendlyName: "Get rfp description",

  description: "",

  inputs: {
    rfp: {
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
      outputFriendlyName: "RFP description",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper get-rfp-description");

    let key = `RFP_DESCRIPTION_${inputs.rfp.type.toUpperCase()}`;
    let translation = await Waspha_translation_all.find({ key: key });
    translation = translation[0];

    var items = await Request_for_proposal_item.find({
      where: { rfp_id: inputs.rfp.rfp_id },
      select: ["name"],
    }).populate("product_id");

    let translated_title = { en: "", ar: "" };
    for (item of items) {
      // sails.log({ prod: item.product_id });
      title = item.name;
      if (item.product_id) {
        title = item.product_id.title || item.product_id.title_ar;
      }
      translated_title.en += title + ", ";
      translated_title.ar += title + ", ";
    }
    translated_title.en = translated_title.en.replace(/,\s*$/, "");
    translated_title.ar = translated_title.ar.replace(/,\s*$/, "");
    // if (inputs.rfp.type == "delivery") {
    //   translated_title.en += ` and wants this to be delivered at ${inputs.rfp.delivery_location}`;
    //   translated_title.ar += `${inputs.rfp.delivery_location} ويريد أن يتم تسليمه في `;
    // } else {
    //   translated_title.en += ` and will pickup`;
    //   translated_title.ar += `وسوف تلتقط `;
    // }

    translated_description = translation[inputs.language]
      .replace("{user}", inputs.rfp.user_name)
      .replace("{delivery_location}", inputs.rfp.delivery_location)
      .replace("{item_names}", translated_title[inputs.language]);
    // sails.log(`desription for rfp id ${inputs.rfp.rfp_id} is: ${description}`);
    return exits.success(translated_description);
  },
};
