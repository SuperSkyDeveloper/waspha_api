module.exports = {
  friendlyName: "Get translation",

  description: "",

  inputs: {
    id: {
      type: "number",
      required: true,
    },
  },

  exits: {
    notFound: {
      responseType: "notFound",
      description: "Send notFound response",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action admin/get-translation");
    const translation = await Waspha_translation_all.findOne({
      where: { id: inputs.id },
      select: ["id", "key", "en", "ar"],
    });
    if (translation) {
      translation.name = {
        en: translation.en,
        ar: translation.ar,
      };

      return exits.success({
        status: true,
        message: "translation found successfully",
        data: translation,
      });
    }
    return exits.notFound({
      status: false,
      message: "Not found",
      data: [],
    });
  },
};
