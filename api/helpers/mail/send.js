const nodemailer = require("nodemailer");

module.exports = {
  friendlyName: "Send email",

  description: "",
  sync: true,
  inputs: {
    recipient: {
      type: "string",
      required: true,
    },
    subject: {
      type: "string",
      required: true,
    },
    body: {
      type: "string",
      required: true,
    },
    reply_to: {
      type: "string",
      required: false,
      allowNull: true,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: function (inputs, exits) {
    sails.log("calling action helper/mail/send start");
    try {
      // Generate test SMTP service account from ethereal.email
      // Only needed if you don't have a real mail account for testing
      // create reusable transporter object using the default SMTP transport
      // let transporter = nodemailer.createTransport({
      //   host: sails.config.mail.host,
      //   port: sails.config.mail.port,
      //   secure: false, // true for 465, false for other ports
      //   auth: {
      //     user: sails.config.mail.username, // generated ethereal user
      //     pass: sails.config.mail.password, // generated ethereal password
      //   },
      //   tls: {
      //     rejectUnauthorized: false,
      //   },
      // });
      let transporter = nodemailer.createTransport({
        service: sails.config.mail.service,
        host: sails.config.mail.host,
        port: sails.config.mail.port,
        secureConnection: true,

        auth: {
          user: sails.config.mail.username, // generated ethereal user
          pass: sails.config.mail.password, // generated ethereal password
        },
      });

      let rec_mail = {
        from: `"Waspha " <${sails.config.mail.username}>`, // sender address
        to: inputs.recipient, // list of receivers
        subject: inputs.subject, // Subject line
        // text: "Hello world?", // plain text body
        html: inputs.body, // html body
      };
      if (inputs.reply_to) {
        rec_mail["replyTo"] = inputs.reply_to;
      }

      // send mail with defined transport object
      let info = transporter.sendMail(rec_mail);
      sails.log({ reply_to: rec_mail, info: info });
      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

      sails.log("calling action helper/mail/send end");
      return exits.success(info);
    } catch (err) {
      sails.log.error(`Error in helper mail/send. ${err}`);
      return exits.success();
    }
  },
};
