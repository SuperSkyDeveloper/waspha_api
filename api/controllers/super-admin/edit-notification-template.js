const { SharedIniFileCredentials } = require("aws-sdk");

module.exports = {
  friendlyName: "Edit Notification template",

  description: "",

  inputs: {
    id: {
      type: "string",
      required: true,
    },
    title: {
      type: "ref",
      required: true,
    },
    body: {
      type: "ref",
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
    sails.log("calling action admin/edit-Notification template");
    sails.log({ inputs: inputs });

    const rec = {
      en: inputs.body.en,
      ar: inputs.body.ar,
    };
    let found = await Notification_template.find({
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

    const template = await Notification_template.updateOne({
      id: inputs.id,
    }).set(rec);
    if (template) {
      await Notification_template_meta.updateOne({
        notification_template_id: template.id,
      }).set({
        en: inputs.title.en,
        ar: inputs.title.ar,
      });

      return exits.success({
        status: true,
        message: `Notification template updated successfully`,
        data: template,
      });
    }

    return exits.ok({
      status: false,
      message: `Unable to update Notification template`,
      data: [],
    });
  },
};
