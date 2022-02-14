module.exports = {
  friendlyName: "Submit contact us",

  description: "",

  inputs: {
    vendor: {
      type: "ref",
      required: true,
      description: "logged in vendor",
    },
    subject: {
      type: "string",
      required: true,
    },
    message: {
      type: "string",
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
    sails.log("calling action vendor/submit-contact-us");
    const rec = {
      user_id: inputs.vendor.id,
      user_role: global.ROLE.VENDOR,
      subject: inputs.subject,
      message: inputs.message,
      reply_to: inputs.vendor.email,
    };

    var contact_us = await sails.helpers.general.sendContactUs(rec);
    if (contact_us) {
      return exits.success({
        status: true,
        message: sails.config.strings[inputs.vendor.language].FORM_SUBMITTED,
        data: contact_us,
      });
    }

    return exits.ok({
      status: true,
      message:
        sails.config.strings[inputs.vendor.language].UNABLE_TO_SUBMIT_FORM,
      data: [],
    });
  },
};
