const strings = sails.config.strings;
module.exports = {
  friendlyName: "Edit business category",

  description: "",

  inputs: {
    vendor: {
      type: "ref",
      required: true,
      description: "logged in vendor",
    },
    id: {
      type: "number",
      required: true,
    },
    parent_id: {
      type: "number",
      required: false,
    },
    name: {
      type: "ref",
      required: true,
    },
    slug: {
      type: "string",
      required: false,
    },
    image: {
      type: "ref",
      required: false,
    },
    description: {
      type: "ref",
      required: false,
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
    sails.log("calling action vendor/edit-business-category");
    sails.log("payload:", inputs);
    const id = inputs.id;
    const name = inputs.name;
    const slug = inputs.slug;
    const image = inputs.image;
    let categories = await Business_category.find({ id: id }).limit(1);

    if (!categories[0]) {
      return exits.ok({
        status: false,
        data: [],
        message: strings[inputs.vendor.language].INVALID_CATEGORY_ID,
      });
    }
    if (name.en) {
      let otherCategoryWithSameName = await Business_category.find({
        and: [{ id: { "!=": id } }, { name: name.en }],
      });
      if (otherCategoryWithSameName.length) {
        return exits.success({
          status: false,
          data: otherCategoryWithSameName[0],
          message:
            strings[inputs.vendor.language].CATEGORY_WITH_NAME_ALREADY_EXIST,
        });
      }
    }

    const rec = {
      name: name.en,
      name_ar: name.ar,
    };
    if (inputs.parent_id) {
      const parentExists = await sails.helpers.businessCategoryExist.with({
        id: inputs.parent_id,
      });
      if (parentExists === false || inputs.parent_id === categories[0].id) {
        return exits.success({
          status: false,
          message: strings[inputs.vendor.language].INVALID_PARENT_ID,
          data: [],
        });
      }
      rec["parent_id"] = inputs.parent_id;
    }

    if (inputs.image) {
      if (categories[0].image) {
        let existingImagePath = categories[0].image;
        let position = await sails.helpers.getCharacterPosition(
          existingImagePath,
          "/",
          3
        );
        await sails.helpers.aws.deleteFile(
          existingImagePath.substring(position + 1)
        );
      }
      // rec['image'] = await sails.helpers.aws.uploadFile(inputs.image,'categories');
      rec["image"] = inputs.image.en;
      rec["image_ar"] = inputs.image.ar;
    }
    if (inputs.description) {
      rec["description"] = inputs.description.en;
      rec["description_ar"] = inputs.description.ar;
    }

    try {
      var updatedCategory = await sails.models.business_category
        .updateOne({ id: inputs.id })
        .set(rec);

      if (updatedCategory.id) {
        sails.log(`category updated with id '${updatedCategory.id}'`);

        return exits.success({
          status: true,
          data: updatedCategory,
          message: strings[inputs.vendor.language].UPDATED,
        });
      }
    } catch (err) {
      sails.log.error(`Error in updating category: ${err}`);
      return exits.serverError({
        status: false,
        message: strings[inputs.vendor.language].UNABLE_TO_UPDATE,
      });
      // …
    }
  },
};
