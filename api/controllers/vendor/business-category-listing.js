const { exists } = require("grunt");

module.exports = {
  friendlyName: "Business category listing",

  description: "",

  inputs: {
    vendor: {
      type: "ref",
      required: true,
      description: "logged in vendor",
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
    sails.log("calling action vendor/business-category-listing");
    try {
      const categories = await Business_category.find({
        where: { store_id: inputs.vendor.store.id, deletedAt: null },
        select: [
          "id",
          "parent_id",
          "name",
          "name_ar",
          "slug",
          "image",
          "image_ar",
          "description",
          "description_ar",
        ],
      });

      if (categories.length) {
        for (cat of categories) {
          cat.name = {
            en: cat.name,
            ar: cat.name_ar,
          };
          cat.description = {
            en: cat.description,
            ar: cat.description_ar,
          };
          cat.image = {
            en: cat.image,
            ar: cat.image_ar,
          };
          delete cat.name_ar;
          delete cat.image_ar;
          delete cat.description_ar;
        }
        return exits.success({
          status: true,
          message: "",
          data: categories,
        });
      }
      return exits.ok({
        status: true,
        message: "",
        data: [],
      });
    } catch (err) {
      sails.log.error(
        `Error getting business categories for store id ${inputs.vendor.store.id}. ${err}`
      );
      return exits.ok({
        status: true,
        message: "",
        data: [],
      });
    }
  },
};
