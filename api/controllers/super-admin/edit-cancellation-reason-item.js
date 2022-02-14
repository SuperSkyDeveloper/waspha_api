module.exports = {
  friendlyName: "Edit cancellation reason item",

  description: "",

  inputs: {
    id: {
      type: "number",
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
    sails.log("calling action admin/edit-cancellation-reason-item");
    sails.log({ inputs: inputs });
    const rec = {
      en: inputs.en,
      ar: inputs.ar,
    };
    let found = await Setting_option.find({
      where: { id: inputs.id },
    }).limit(1);

    if (!found.length) {
      return exits.ok({
        status: false,
        message: `Invalid id`,
        data: [],
      });
    }

    const setting = await Setting_option.updateOne({
      id: inputs.id,
    }).set(rec);

    if (setting) {
      return exits.success({
        status: true,
        message: `setting updated successfully`,
        data: setting,
      });
    }

    return exits.ok({
      status: false,
      message: `Unable to update setting`,
      data: [],
    });
  },
};
