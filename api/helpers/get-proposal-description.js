module.exports = {
  friendlyName: "Get proposal description",

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
    sails.log("calling helper get-proposal-description");
    //sails.log({ proposal: inputs.proposal });
    let language = inputs.language;
    let key = `PROPOSAL_DESCRIPTION_${inputs.proposal.type.toUpperCase()}`;
    if ([global.STATUS.COMPLETED].includes(inputs.proposal.status)) {
      key = `PROPOSAL_PAST_DESCRIPTION_${inputs.proposal.type.toUpperCase()}`;
    }
    let translation = await Waspha_translation_all.find({ key: key });
    translation = translation[0];
    if (inputs.proposal.order_type == global.ORDER_TYPE.TRADITIONAL) {
      if (await sails.helpers.isJsonString(inputs.proposal.delivery_location)) {
        inputs.proposal.delivery_location = JSON.parse(
          inputs.proposal.delivery_location
        );
        inputs.proposal.delivery_location =
          inputs.proposal.delivery_location.address;
      }
    }

    // let looking_for = {
    //   en: [global.STATUS.COMPLETED].includes(inputs.proposal.status)
    //     ? "received"
    //     : "is looking for",
    //   ar: [global.STATUS.COMPLETED].includes(inputs.proposal.status)
    //     ? "تم الاستلام"
    //     : "البحث عن",
    // };
    // let wants_this = {
    //   en: [global.STATUS.COMPLETED].includes(inputs.proposal.status)
    //     ? "and received"
    //     : "and wants this to be delivered",
    //   ar: [global.STATUS.COMPLETED].includes(inputs.proposal.status)
    //     ? "تم الاستلام"
    //     : "البحث عن",
    // };
    // let will_pickup = {
    //   en: [global.STATUS.COMPLETED].includes(inputs.proposal.status)
    //     ? "and picked up"
    //     : "and will pickup",
    //   ar: [global.STATUS.COMPLETED].includes(inputs.proposal.status)
    //     ? "والتقطت"
    //     : "وسوف تلتقط",
    // };
    // var description = {
    //   en: `${inputs.proposal.user_name} ${looking_for.en} items `,
    //   ar: ` ${inputs.proposal.user_name} ${looking_for.ar} العناصر`,
    // };

    var items = await Proposal_item.find({
      where: { proposal_id: inputs.proposal.proposal_id },
      select: ["title"],
    }).populate("product_id");

    let translated_title = { en: "", ar: "" };
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
    //sails.log({ item: item, description: description });
    // if (inputs.proposal.type == "delivery") {
    //   description.en += ` ${wants_this.en} at ${inputs.proposal.delivery_location}`;
    //   description.ar += `${inputs.proposal.delivery_location} ${wants_this.ar} في `;
    // } else {
    //   description.en += ` ${will_pickup.en}`;
    //   description.ar += ` ${will_pickup.ar}`;
    // }
    // sails.log(`desription for proposal id ${inputs.proposal.proposal_id} is: ${description}`);

    translated_description = translation[language]
      .replace("{user}", inputs.proposal.user_name || "user")
      .replace("{delivery_location}", inputs.proposal.delivery_location)
      .replace("{item_names}", translated_title[language]);
    return exits.success(translated_description);
  },
};
