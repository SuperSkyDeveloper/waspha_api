module.exports = {
  friendlyName: "Get faqs",

  description: "",

  inputs: {
    role: {
      type: "string",
      required: true,
    },
    language: {
      type: "string",
      required: false,
      isIn: ["en", "ar", "EN", "AR"],
      defaultsTo: "en",
    },
  },

  exits: {
    success: {
      outputFriendlyName: "Faqs",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper get-faqs");
    let faqs = [];
    switch (inputs.role) {
      case global.ROLE.VENDOR: {
        faqs = await sails.models.faq.find({
          select: ["id", "title", "description", "title_ar", "description_ar"],
        });
        break;
      }
      case global.ROLE.USER: {
        faqs = await sails.models.user_faq.find({
          select: ["id", "title", "description", "title_ar", "description_ar"],
        });
        break;
      }
      case global.ROLE.DRIVER: {
        faqs = await sails.models.driver_faq.find({
          select: ["id", "title", "description", "title_ar", "description_ar"],
        });
        break;
      }
    }
    for (faq of faqs) {
      faq.title = inputs.language == "en" ? faq.title : faq.title_ar;
      faq.description =
        inputs.language == "en" ? faq.description : faq.description_ar;

      delete faq.title_ar;
      delete faq.description_ar;
    }

    if (faqs.length) {
      return exits.success(faqs);
    }
    return exits.success([]);
  },
};
