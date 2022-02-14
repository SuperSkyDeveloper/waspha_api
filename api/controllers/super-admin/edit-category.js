module.exports = {
  friendlyName: "Edit category",

  description: "",

  inputs: {
    id: {
      type: "number",
      required: true,
    },
    parent_id: {
      type: "number",
      required: false,
      allowNull: true,
    },
    en: {
      type: "string",
      required: true,
    },
    ar: {
      type: "string",
      required: true,
    },
    slug: {
      type: "string",
      required: false,
      allowNull: true,
    },
    image: {
      type: "string",
      required: false,
      allowNull: true,
    },
    secondary_image: {
      type: "string",
      required: false,
      allowNull: true,
    },
    description: {
      type: "string",
      required: false,
      allowNull: true,
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
    sails.log("calling action admin/edit-category");

    let categories = await Category.find({ id: inputs.id }).limit(1);
    const en = inputs.en;
    const ar = inputs.ar;
    const slug = inputs.slug;

    if (!categories[0]) {
      return exits.ok({
        status: false,
        data: [],
        message: "Invalid category id",
      });
    }
    const rec = {
      en: en,
      ar: ar,
    };
    if (inputs.parent_id) {
      const parentExists = await sails.helpers.categoryExist.with({
        id: inputs.parent_id,
      });
      if (parentExists === false) {
        return exits.success({
          status: false,
          message: "Invalid parent id",
          data: [],
        });
      }
      rec["parent_id"] = inputs.parent_id;
    }

    if (inputs.image) {
      sails.log({ image: inputs.image });
      is_valid_url = await sails.helpers.isValidUrl(inputs.image);
      if (!is_valid_url) {
        let existingImagePath = categories[0].image;
        if (existingImagePath != null) {
          let position = await sails.helpers.getCharacterPosition(
            existingImagePath,
            "/",
            3
          );
          await sails.helpers.aws.deleteFile(
            existingImagePath.substring(position + 1)
          );
        }

        inputs.image = await sails.helpers.aws.uploadFile(
          inputs.image,
          "categories"
        );
      }

      rec["image"] = inputs.image;
    }
    if (inputs.secondary_image) {
      sails.log({ secondary_image: inputs.secondary_image });
      is_valid_url = await sails.helpers.isValidUrl(inputs.secondary_image);
      if (!is_valid_url) {
        let existingImagePath = categories[0].secondary_image;
        if (existingImagePath != null) {
          let position = await sails.helpers.getCharacterPosition(
            existingImagePath,
            "/",
            3
          );
          await sails.helpers.aws.deleteFile(
            existingImagePath.substring(position + 1)
          );
        }

        inputs.secondary_image = await sails.helpers.aws.uploadFile(
          inputs.secondary_image,
          "categories"
        );
      }

      rec["secondary_image"] = inputs.secondary_image;
    }
    if (inputs.description) {
      rec["description"] = inputs.description;
    }

    try {
      var updatedCategory = await sails.models.category
        .updateOne({ id: inputs.id })
        .set(rec);

      if (updatedCategory.id) {
        sails.log(`category updated with id '${updatedCategory.id}'`);

        return exits.success({
          status: true,
          data: updatedCategory,
          message: "category updated successfully",
        });
      }
    } catch (err) {
      sails.log.error(`Error in updating category: ${err}`);
      return exits.serverError({
        status: false,
        message: `Error in updating category: ${err}`,
      });
      // …
    }
  },
};
