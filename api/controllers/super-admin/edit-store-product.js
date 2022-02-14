module.exports = {
  friendlyName: "Edit store product",

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
    category_id: {
      type: "number",
      required: false,
      allowNull: true,
    },
    title: {
      type: "string",
      required: false,
      allowNull: true,
    },
    title_ar: {
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
    is_featured: {
      type: "boolean",
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
    sails.log("calling action admin/edit-store-product");

    let store_products = await Store_product.find({ id: inputs.id }).limit(1);

    if (!store_products[0]) {
      return exits.ok({
        status: false,
        data: [],
        message: "Invalid store product id",
      });
    }

    if (!_.isUndefined(inputs.category_id)) {
      if (inputs.category_id > 0) {
        const categoryExists = await sails.helpers.businessCategoryExist.with({
          id: inputs.category_id,
        });
        if (!categoryExists) {
          return exits.ok({
            status: false,
            message: strings[inputs.admin.language].INVALID_CATEGORY_ID,
            data: [],
          });
        }
      }
    }

    if (inputs.image) {
      sails.log({ image: inputs.image });
      is_valid_url = await sails.helpers.isValidUrl(inputs.image);
      if (!is_valid_url) {
        let existingImagePath = store_products[0].image;
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
          "store-products"
        );
      }
    }
    if (inputs.image_ar) {
      is_valid_url = await sails.helpers.isValidUrl(inputs.image_ar);
      if (!is_valid_url) {
        let existingImagePath = store_products[0].image_ar;
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
          "store-products"
        );
      }
    }
    try {
      var updatedstore_product = await sails.models.store_product
        .updateOne({ id: inputs.id })
        .set(inputs);

      if (updatedstore_product.id) {
        sails.log(`store product updated with id '${updatedstore_product.id}'`);

        return exits.success({
          status: true,
          data: updatedstore_product,
          message: "store product updated successfully",
        });
      }
    } catch (err) {
      sails.log.error(`Error in updating store product: ${err}`);
      return exits.serverError({
        status: false,
        message: `Error in updating store product: ${err}`,
      });
      // …
    }
  },
};
