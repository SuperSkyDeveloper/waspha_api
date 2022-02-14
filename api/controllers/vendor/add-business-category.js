const strings = sails.config.strings;
module.exports = {
  friendlyName: "Add business category",

  description: "",

  inputs: {
    vendor: {
      type: "ref",
      required: true,
      description: "logged in vendor",
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
    sails.log("calling action vendor/add-business-category");

    let categories = await Business_category.find({
      and: [{ name: { "!=": null } }, { name: inputs.name.en }],
      store_id: inputs.vendor.store.id,
    }).limit(1);
    const name = inputs.name;
    const slug = typeof inputs.slug !== "undefined" ? inputs.slug : null;

    if (categories[0]) {
      return exits.success({
        status: false,
        data: categories[0],
        message:
          strings[inputs.vendor.language].CATEGORY_WITH_SLUG_ALREADY_EXIST,
      });
    }
    const rec = {
      name: name.en,
      name_ar: name.ar,
      slug: slug,
      store_id: inputs.vendor.store.id,
    };
    if (inputs.parent_id) {
      const parentExists = await sails.helpers.businessCategoryExist.with({
        id: inputs.parent_id,
      });
      if (parentExists === false) {
        return exits.ok({
          status: false,
          message: strings[inputs.vendor.language].INVALID_PARENT_ID,
          data: [],
        });
      }
      rec["parent_id"] = inputs.parent_id;
    }

    if (inputs.image) {
      // rec['image'] = await sails.helpers.aws.uploadFile(inputs.image,'categories');
      rec["image"] = inputs.image.en;
      rec["image_ar"] = inputs.image.ar;
    }
    if (inputs.description) {
      rec["description"] = inputs.description.en;
      rec["description_ar"] = inputs.description.ar;
    }

    try {
      sails.log({ msg: "creating category", rec: rec });
      var category = await Business_category.create(rec).fetch();

      if (category.id) {
        sails.log(`category created with id '${category.id}'`);

        return exits.success({
          status: true,
          data: category,
          message: strings[inputs.vendor.language].CREATED,
        });
      }
    } catch (err) {
      sails.log.error(`Error in creating category: ${err}`);
      return exits.serverError({
        status: false,
        message: strings[inputs.vendor.language].UNABLE_TO_CREATE,
      });
      // …
    }
  },
};
