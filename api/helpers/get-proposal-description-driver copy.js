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
    sails.log("calling helper get-proposal-desription-driver");
    let language = inputs.language;
    var description = {
      en: `${inputs.proposal.user_name} received items `,
      ar: `${inputs.proposal.user_name} العناصر المستلمة `,
    };

    var items = await Proposal_item.find({
      where: { proposal_id: inputs.proposal.proposal_id },
      select: ["title"],
    }).populate("product_id");

    for (item of items) {
      title = item.title;
      if (item.product_id) {
        title = item.product_id.title;
      }
      description.en += title + ", ";
      description.ar += title + ", ";
    }
    description.en = description.en.replace(/,\s*$/, "");
    description.ar = description.ar.replace(/,\s*$/, "");
    if (inputs.proposal.type == "delivery") {
      description.en += ` at location ${inputs.proposal.delivery_location}`;
      description.ar += ` في الموقع ${inputs.proposal.delivery_location} `;
    } else {
      description.en += ` and picked up`;
      description.ar += ` والتقطت `;
    }
    // sails.log(`desription for proposal id ${inputs.proposal.proposal_id} is: ${description}`);
    return exits.success(description[language]);
  },
};
