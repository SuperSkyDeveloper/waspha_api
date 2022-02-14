module.exports = {
  friendlyName: "Send contact us",

  description: "",

  inputs: {
    record: {
      type: "ref",
      required: true,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper general/send-contact-us");
    try {
      //send email to waspha here
      sails.helpers.mail.send(
        sails.config.mail.recepient,
        inputs.record.subject,
        inputs.record.message,
        inputs.record.reply_to
      );
      delete inputs.record.reply_to;
      const contact_us = await sails.models.contact_us
        .create(inputs.record)
        .fetch();
      return exits.success(contact_us);
    } catch (err) {
      sails.log.error(`Error sending contact us. ${err}`);
      return exits.success(false);
    }
  },
};
