const Nexmo = require("nexmo");
module.exports = {
  friendlyName: "Send sms",

  description: "",
  sync: true,
  inputs: {
    recepient: {
      type: "string",
      required: true,
    },
    message: {
      type: "string",
      required: true,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: function (inputs, exits) {
    sails.log("calling helper send-sms");
    try {
      const nexmo = new Nexmo({
        apiKey: sails.config.nexmo.api_key,
        apiSecret: sails.config.nexmo.secret_key,
      });

      const from = "Waspha";
      const to = inputs.recepient;
      const text = inputs.message;
      sails.log({ aaa: nexmo.message.sendSms(from, to, text) });
      sails.log("sms sent successfully");
      return exits.success(true);
    } catch (err) {
      sails.log.error(`Error in helper send-sms. ${err}`);
      return exits.success(false);
    }
  },
};
