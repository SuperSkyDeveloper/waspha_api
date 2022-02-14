const moment = require("moment");
module.exports = {
  friendlyName: "Delete business category",

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
    sails.log("calling action vendor/delete-business-category");

    const id = inputs.id;

    let categories = await Business_category.find({
      id: id,
      store_id: inputs.vendor.store.id,
    })
      .populate("children")
      .limit(1);

    if (!categories[0]) {
      return exits.ok({
        status: false,
        message:
          sails.config.strings[inputs.vendor.language].INVALID_CATEGORY_ID,
        data: [],
      });
    }
    sails.log({ children: categories[0].children });
    try {
      child_ids = [];
      if (categories[0].children) {
        child_ids = _.map(categories[0].children, "id");
      }
      child_ids.push(inputs.id);
      var updatedCategory = await sails.models.business_category
        .update({ or: [{ id: child_ids }, { parent_id: child_ids }] })
        .set({ deletedAt: moment().format("YYYY-MM-DD HH:mm:ss") });

      await Store_product.update({
        store_id: inputs.vendor.store.id,
        or: [{ category_id: child_ids }, { category_id: child_ids }],
      }).set({ category_id: null });

      sails.log(`category deleted with id '${inputs.id}'`);

      return exits.success({
        status: true,
        message: sails.config.strings[inputs.vendor.language].DELETED,
        data: updatedCategory,
      });
    } catch (err) {
      sails.log.error(`Error in deleting category: ${err}`);
      return exits.serverError({
        status: false,
        message: sails.config.strings[inputs.vendor.language].UNABLE_TO_DELETE,
      });
    }
  },
};
