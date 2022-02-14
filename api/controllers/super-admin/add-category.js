module.exports = {
  friendlyName: "Add category",

  description: "",

  inputs: {
    parent_id: {
      type: "number",
      required: false,
    },
    en: {
      type: "string",
      required: true,
    },
    ar: {
      type: "string",
      required: true,
    },

    image: {
      type: "string",
      required: false,
    },
    secondary_image: {
      type: "string",
      required: false,
    },
    description: {
      type: "string",
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
    sails.log("calling action admin/add-category");

    const en = inputs.en;
    const ar = inputs.ar;
    const slug = await sails.helpers.makeSlug(en);

    const rec = {
      en: en,
      ar: ar,
      slug: slug,
    };
    if (inputs.parent_id) {
      const parentExists = await sails.helpers.categoryExist.with({
        id: inputs.parent_id,
      });
      if (parentExists === false) {
        return exits.ok({
          status: false,
          message: "Invalid parent id",
          data: [],
        });
      }
      rec["parent_id"] = inputs.parent_id;
    }

    if (inputs.image) {
      is_valid_url = await sails.helpers.isValidUrl(inputs.image);
      if (is_valid_url === false) {
        rec["image"] = await sails.helpers.aws.uploadFile(
          inputs.image,
          "categories"
        );
      } else {
        rec["image"] = inputs.image;
      }
    }
    if (inputs.secondary_image) {
      is_valid_url = await sails.helpers.isValidUrl(inputs.secondary_image);
      if (is_valid_url === false) {
        rec["secondary_image"] = await sails.helpers.aws.uploadFile(
          inputs.secondary_image,
          "categories"
        );
      } else {
        rec["secondary_image"] = inputs.secondary_image;
      }
    }
    if (inputs.description) {
      rec["description"] = inputs.description;
    }

    try {
      var category = await Category.create(rec).fetch();

      if (category.id) {
        sails.log(`category created with id '${category.id}'`);

        return exits.success({
          status: true,
          data: category,
          message: "category created successfully",
        });
      }
    } catch (err) {
      sails.log.error(`Error in creating category: ${err}`);
      return exits.serverError({
        status: false,
        message: `Error in creating category: ${err}`,
      });
      // …
    }
  },
};
