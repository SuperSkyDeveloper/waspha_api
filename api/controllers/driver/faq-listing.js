module.exports = {
  friendlyName: "Faq listing",

  description: "Faq listing driver",

  inputs: {
    driver: {
      type: "ref",
      required: true,
      description: "logged in driver",
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
    sails.log("calling action driver/faq-listing");
    const strings = sails.config.strings[inputs.driver.language];
    const faqs = await sails.helpers.getFaqs(
      global.ROLE.DRIVER,
      inputs.driver.language
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
