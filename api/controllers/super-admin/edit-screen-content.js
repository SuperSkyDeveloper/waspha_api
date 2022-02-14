const { SharedIniFileCredentials } = require("aws-sdk");

module.exports = {
  friendlyName: "Edit Screen content",

  description: "",

  inputs: {
    id: {
      type: "string",
      required: true,
    },
    en: {
      type: "string",
      required: true,
    },
    ar: {
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
    sails.log("calling action admin/edit-Screen content");
    sails.log({ inputs: inputs });

    const rec = {
      en: inputs.en,
      ar: inputs.ar,
    };
    let found = await Waspha_setting.find({
      where: { id: inputs.id },
    }).limit(1);

    if (!found.length) {
      return exits.ok({
        status: false,
        message: `Invalid id`,
        data: [],
      });
    }
    sails.log({ inputs: inputs });

    const content = await Waspha_setting.updateOne({
      id: inputs.id,
    }).set(rec);
    if (content) {
      return exits.success({
        status: true,
        message: `Screen content updated successfully`,
        data: content,
      });
    }

    return exits.ok({
      status: false,
      message: `Unable to update Screen content`,
      data: [],
    });
  },
};
