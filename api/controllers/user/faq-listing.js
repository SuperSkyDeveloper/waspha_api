const { SavingsPlans } = require("aws-sdk");

module.exports = {
  friendlyName: "Faq listing",

  description: "",

  inputs: {
    user: {
      type: "ref",
      required: false,
      description: "logged in user",
    },
    language: {
      type: "string",
      required: false,
      defaultsTo: "en",
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
    sails.log("calling action user/faq-listing");
    let language = inputs.language;
    if (inputs.user) {
      language = inputs.user.language;
    }
    const strings = sails.config.strings[language];
    const faqs = await sails.helpers.getFaqs(global.ROLE.USER, language);
    if (faqs.length) {
      return exits.success({
        status: true,
        message: strings.FOUND,
        data: faqs,
      });
    }
    return exits.ok({
      status: true,
      message: strings.NOT_FOUND,
      data: [],
    });
  },
};
