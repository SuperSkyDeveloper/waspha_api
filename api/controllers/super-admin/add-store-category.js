module.exports = {
  friendlyName: "Add store category",

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
    sails.log("calling action admin/add-store-category");

    let store_categorys = await Business_category.find({
      name: inputs.name,
      store_id: inputs.store_id,
      deletedAt: null,
    }).limit(1);

    if (store_categorys[0]) {
      return exits.success({
        status: false,
        data: store_categorys[0],
        message: "store category with this name already exists",
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
            message: strings[inputs.admin.language].INVALID_PARENT_ID,
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
          "store-categories"
        );
      }
    }
    if (inputs.image_ar) {
      is_valid_url = await sails.helpers.isValidUrl(inputs.image_ar);
      if (is_valid_url === false) {
        inputs.image_ar = await sails.helpers.aws.uploadFile(
          inputs.image_ar,
          "store-categories"
        );
      }
    }

    try {
      var store_category = await Business_category.create(inputs).fetch();

      if (store_category.id) {
        sails.log(`store_category created with id '${store_category.id}'`);

        return exits.success({
          status: true,
          data: store_category,
          message: "store category created successfully",
        });
      }
    } catch (err) {
      sails.log.error(`Error in creating store category: ${err}`);
      return exits.serverError({
        status: false,
        message: `Error in creating store category: ${err}`,
      });
      // …
    }
  },
};
