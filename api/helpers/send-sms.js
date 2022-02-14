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
      let options = {
        // If true, log information to the console
        debug: true | false,
        // append info the the User-Agent sent to Nexmo
        // e.g. pass 'my-app' for /nexmo-node/1.0.0/4.2.7/my-app
        // appendToUserAgent: string,
        // Set a custom logger
        logger: {
          // log: function() {level, args...}
          // info: function() {args...},
          // warn: function() {args...}
        },
        // Set a custom timeout for requests to Nexmo in milliseconds. Defaults to the standard for Node http requests, which is 120,000 ms.
        timeout: 10,
        // Set a custom host for requests instead of api.nexmo.com
        //  apiHost: string,
        // Set a custom host for requests instead of rest.nexmo.com
        // restHost: string,
      };
      callback = (error, response) => {
        if (error) {
          console.error(error);
        }

        if (response) {
          console.log(response);
        }
      };

      nexmo.message.sendSms(from, to, text, options, callback),
        sails.log("sms sent successfully");
      return exits.success(true);
    } catch (err) {
      sails.log.error(`Error in helper send-sms. ${err}`);
      return exits.success(false);
    }
  },
};
