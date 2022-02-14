const { SharedIniFileCredentials } = require("aws-sdk");

module.exports = {
  friendlyName: "Edit translation",

  description: "",

  inputs: {
    id: {
      type: "string",
      required: true,
    },
    key: {
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
    sails.log("calling action admin/edit-translation");
    const rec = {
      key: inputs.key,
      en: inputs.en,
      ar: inputs.ar,
    };
    let found = await Waspha_translation_all.find({
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
    // let other = await Waspha_translation_all.find({
    //   where: { id: { "!=": inputs.id }, key: inputs.key },
    // }).limit(1);

    let query = `SELECT * FROM waspha_translations_all t
    WHERE id != ${inputs.id}
    AND t.key = '${inputs.key}'`;
    let result = await sails.sendNativeQuery(query);
    if (result.rows.length) {
      return exits.ok({
        status: false,
        message: `Key already exists`,
        data: [],
      });
    }
    // if (other.length) {
    //   return exits.ok({
    //     status: false,
    //     message: `Key already exists`,
    //     data: [],
    //   });
    // }

    const translation = await Waspha_translation_all.updateOne({
      id: inputs.id,
    }).set(rec);
    if (translation) {
      return exits.success({
        status: true,
        message: `translation updated successfully`,
        data: translation,
      });
    }

    return exits.ok({
      status: false,
      message: `Unable to update translation`,
      data: [],
    });
  },
};
