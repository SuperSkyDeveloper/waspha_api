module.exports = {
  friendlyName: "Get translations",

  description: "",

  inputs: {
    role: {
      type: "string",
      required: true,
    },
  },

  exits: {
    success: {
      outputFriendlyName: "Translations",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper general/get-translations");
    let translations = [];
    let data = { strings: {} };
    try {
      switch (inputs.role) {
        case global.ROLE.VENDOR: {
          translations = await Waspha_translation_all.find();
          break;
        }
        case global.ROLE.USER: {
          translations = await Waspha_translation_all.find();
          break;
        }
        case global.ROLE.DRIVER: {
          translations = await Waspha_translation_all.find();
          break;
        }
      }
      if (translations.length) {
        en = {};
        ar = {};
        for (row of translations) {
          en[row.key] = row.en;
          ar[row.key] = row.ar;
        }

        data["strings"]["en"] = en;
        data["strings"]["ar"] = ar;
      }
      return exits.success(data);
    } catch (err) {
      sails.log.error(`Error in helper general/get-translations. ${err}`);
      return exits.success([]);
    }
  },
};
