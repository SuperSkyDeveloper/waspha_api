module.exports = {
  friendlyName: "Add translation",

  description: "",

  inputs: {
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
    sails.log("calling action admin/add-translation");
    let key = inputs.key.toUpperCase();
    const rec = {
      key: key,
      en: inputs.en,
      ar: inputs.ar,
    };
    // let found = await Waspha_translation_all.find({
    //   where: { key: key },
    // }).limit(1);

    let query = `SELECT * FROM waspha_translations_all t
    WHERE t.key = '${key}'`;
    let result = await sails.sendNativeQuery(query);
    if (result.rows.length) {
      return exits.ok({
        status: false,
        message: `Key already exists`,
        data: [],
      });
    }

    const translation = await Waspha_translation_all.create(rec).fetch();
    if (translation) {
      return exits.success({
        status: true,
        message: `translation created successfully`,
        data: translation,
      });
    }

    return exits.ok({
      status: false,
      message: `Unable to create translation`,
      data: [],
    });
  },
};
