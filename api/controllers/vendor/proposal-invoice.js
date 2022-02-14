const Proposal = require("../../models/Proposal");

module.exports = {
  friendlyName: "Proposal invoice",

  description: "",

  inputs: {
    vendor: {
      type: "ref",
      required: true,
      description: "logged in vendor",
    },
    proposal_id: {
      type: "number",
      required: true,
    },
  },

  exits: {
    serverError: {
      description: "send server error",
      responseType: "serverError",
    },
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action vendor/proposal-invoice");
    const strings = sails.config.strings[inputs.vendor.language];
    const proposal = await sails.models.proposal
      .findOne({ id: inputs.proposal_id })
      .populate("items");
    data = {};
    if (proposal) {
      for (item of proposal.items) {
        item.name = item.title;
        item.description = item.requirements;
        delete item.title;
        delete item.requirements;
        delete item.proposal_id;

        if (item.product_id) {
          item.name = {
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
        }
        delete item.product_id;
      }
      data = await sails.helpers.getProposalInvoice.with({
        proposal_id: proposal.id,
        language: inputs.vendor.language,
      });
      return exits.success({
        status: true,
        message: strings.FOUND,
        data: data,
      });
    }

    return exits.ok({
      status: false,
      message: strings.INVALID_PROPOSAL_ID,
      data: data,
    });
  },
};
