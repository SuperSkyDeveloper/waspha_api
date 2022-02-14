module.exports = {
  friendlyName: "Edit store category",

  description: "",

  inputs: {
    admin: {
      type: "ref",
      description: "Logged in admin",
    },
    id: {
      type: "number",
      required: true,
    },
    parent_id: {
      type: "number",
      required: false,
      allowNull: true,
    },
    name: {
      type: "string",
      required: false,
      allowNull: true,
    },
    name_ar: {
      type: "string",
      required: false,
      allowNull: true,
    },
    description: {
      type: "string",
      required: false,
      allowNull: true,
    },
    description_ar: {
      type: "string",
      required: false,
      allowNull: true,
    },
    image: {
      type: "string",
      required: false,
      allowNull: true,
    },
    image_ar: {
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
    sails.log("calling action admin/edit-store-category");

    let store_categories = await Business_category.find({
      id: inputs.id,
    }).limit(1);

    if (!store_categories[0]) {
      return exits.ok({
        status: false,
        data: [],
        message: "Invalid store category id",
      });
    }

    if (!_.isUndefined(inputs.parent_id)) {
      if (inputs.parent_id > 0) {
        const categoryExists = await sails.helpers.businessCategoryExist.with({
          id: inputs.parent_id,
        });
        if (!categoryExists) {
          return exits.ok({
            status: false,
            message: strings[inputs.admin.language].INVALID_parent_id,
            data: [],
          });
        }
      }
    }

    if (inputs.image) {
      sails.log({ image: inputs.image });
      is_valid_url = await sails.helpers.isValidUrl(inputs.image);
      if (!is_valid_url) {
        let existingImagePath = store_categories[0].image;
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
          "store-categories"
        );
      }
    }
    if (inputs.image_ar) {
      is_valid_url = await sails.helpers.isValidUrl(inputs.image_ar);
      if (!is_valid_url) {
        let existingImagePath = store_categories[0].image_ar;
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

        inputs.image_ar = await sails.helpers.aws.uploadFile(
          inputs.image_ar,
          "store-categories"
        );
      }
    }
    try {
      var updatedstore_category = await sails.models.business_category
        .updateOne({ id: inputs.id })
        .set(inputs);

      if (updatedstore_category.id) {
        sails.log(
          `store category updated with id '${updatedstore_category.id}'`
        );

        return exits.success({
          status: true,
          data: updatedstore_category,
          message: "store category updated successfully",
        });
      }
    } catch (err) {
      sails.log.error(`Error in updating store category: ${err}`);
      return exits.serverError({
        status: false,
        message: `Error in updating store category: ${err}`,
      });
      // …
    }
  },
};
