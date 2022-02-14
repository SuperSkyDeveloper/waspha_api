module.exports = {
  friendlyName: "Send otp",

  description: "",

  inputs: {
    recipient: {
      type: "string",
      required: true,
    },
    otp: {
      type: "number",
      required: true,
    },
    msg: {
      type: "string",
      required: true,
    },
    is_email: {
      type: "boolean",
      required: true,
    },
    subject: {
      type: "string",
      required: false,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    let msg = null;
    try {
      if (inputs.is_email == true) {
        sails.helpers.mail.send(
          inputs.recipient,
          inputs.subject || "Forget Password",
          inputs.msg
        );
      } else {
        sails.helpers.sendSms(inputs.recipient, inputs.msg);
      }
      return exits.success();
    } catch (err) {
      sails.log(`error in helper send-otp. ${err}`);
      return exits.success();
    }
  },
};
