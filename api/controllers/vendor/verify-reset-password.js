module.exports = {
  friendlyName: "Verify reset password",

  description: "",

  inputs: {
    vendor_id: {
      type: "json",
      required: true,
    },
    otp: {
      type: "number",
      required: true,
    },
    language: {
      type: "string",
      required: false,
      defaultsTo: "en",
    },
  },

  exits: {
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action vendor/verify-reset-password");
    const strings = sails.config.strings[inputs.language];
    var is_email = _.isString(inputs.vendor_id);
    if (is_email) {
      var vendor_id = inputs.vendor_id.toLowerCase();
      vendor = await Vendor.findOne({ email: vendor_id, otp: inputs.otp });
    } else {
      contact = inputs.vendor_id.number.replace(/\s/g, "");
      vendor = await Vendor.findOne({
        contact: contact,
        country_code: inputs.vendor_id.country_code,
        otp: inputs.otp,
      });
    }

    if (!vendor) {
      sails.log.warn(
        `vendor with email or contact '${inputs.vendor_id}' and otp '${inputs.otp}' not exists, returning response`
      );
      return exits.ok({
        status: false,
        message: strings.INVALID_OTP,
        data: [],
      });
    }
    return exits.success({
      status: true,
      message: strings.YOU_CAN_RESET_PASSWORD_NOW,
      data: [],
    });
  },
};
