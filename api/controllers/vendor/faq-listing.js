module.exports = {
  friendlyName: "Faq listing",

  description: "",

  inputs: {
    vendor: {
      type: "ref",
      required: true,
      description: "logged in vendor",
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
    sails.log("calling action vendor/faq-listing");
    const strings = sails.config.strings[inputs.vendor.language];
    const faqs = await sails.helpers.getFaqs(
      global.ROLE.VENDOR,
      inputs.vendor.language
    );
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
