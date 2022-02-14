module.exports = {
  friendlyName: "Edit setting",

  description: "",

  inputs: {
    id: {
      type: "string",
      required: true,
    },
    value: {
      type: "number",
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
    sails.log("calling action admin/edit-setting");
    sails.log({ inputs: inputs });
    const rec = {
      value: inputs.value,
    };
    let found = await Setting.find({
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

    const setting = await Setting.updateOne({
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
