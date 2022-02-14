module.exports = {
  friendlyName: "Submit contact us user",

  description: "",

  inputs: {
    user: {
      type: "ref",
      required: true,
      description: "logged in user",
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
    sails.log("calling action user/submit-contact-us");

    const rec = {
      user_id: inputs.user.id,
      user_role: global.ROLE.USER,
      subject: inputs.subject,
      message: inputs.message,
      reply_to: inputs.user.email,
    };

    var contact_us = await sails.helpers.general.sendContactUs(rec);
    if (contact_us) {
      return exits.success({
        status: true,
        message: sails.config.strings[inputs.user.language].FORM_SUBMITTED,
        data: contact_us,
      });
    }

    return exits.ok({
      status: true,
      message: sails.config.strings[inputs.user.language].UNABLE_TO_SUBMIT_FORM,
      data: [],
    });
  },
};
