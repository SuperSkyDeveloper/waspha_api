module.exports = {
  friendlyName: "Add store product",

  description: "",

  inputs: {
    admin: {
      type: "ref",
      description: "Logged in admin",
    },
    store_id: {
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
    sails.log("calling action admin/add-store-product");

    let store_products = await Store_product.find({
      title: inputs.title,
      store_id: inputs.store_id,
      deletedAt: null,
    }).limit(1);

    if (store_products[0]) {
      return exits.success({
        status: false,
        data: store_products[0],
        message: "store product with this title already exists",
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
      is_valid_url = await sails.helpers.isValidUrl(inputs.image);
      if (is_valid_url === false) {
        inputs.image = await sails.helpers.aws.uploadFile(
          inputs.image,
          "store-products"
        );
      }
    }
    if (inputs.image_ar) {
      is_valid_url = await sails.helpers.isValidUrl(inputs.image_ar);
      if (is_valid_url === false) {
        inputs.image_ar = await sails.helpers.aws.uploadFile(
          inputs.image_ar,
          "store-products"
        );
      }
    }

    try {
      var store_product = await Store_product.create(inputs).fetch();

      if (store_product.id) {
        sails.log(`store_product created with id '${store_product.id}'`);

        return exits.success({
          status: true,
          data: store_product,
          message: "store product created successfully",
        });
      }
    } catch (err) {
      sails.log.error(`Error in creating store product: ${err}`);
      return exits.serverError({
        status: false,
        message: `Error in creating store product: ${err}`,
      });
      // …
    }
  },
};
