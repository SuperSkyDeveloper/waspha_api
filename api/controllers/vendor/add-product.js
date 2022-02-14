const strings = sails.config.strings;
const moment = require("moment");
module.exports = {
  friendlyName: "Add product",

  description: "",

  inputs: {
    vendor: {
      type: "ref",
      required: true,
      description: "logged in vendor",
    },
    category_id: {
      type: "number",
      required: false,
    },
    title: {
      type: "ref",
      required: true,
    },
    description: {
      type: "ref",
      required: false,
    },
    image: {
      type: "ref",
      required: false,
    },
    is_featured: {
      type: "boolean",
      required: false,
    },
    menu_promotion: {
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
    sails.log("calling action vendor/add-product");
    let stores = await Store.find({ vendor_id: inputs.vendor.id }).limit(1);
    if (stores[0]) {
      const title = inputs.title;

      const rec = {
        store_id: stores[0].id,
        title: title.en,
        title_ar: title.ar,
      };
      if (!_.isUndefined(inputs.category_id)) {
        if (inputs.category_id > 0) {
          rec.category_id = inputs.category_id;
          const categoryExists = await sails.helpers.businessCategoryExist.with(
            { id: rec.category_id, store_id: inputs.vendor.store.id }
          );
          if (!categoryExists) {
            return exits.ok({
              status: false,
              message: strings[inputs.vendor.language].INVALID_CATEGORY_ID,
              data: [],
            });
          }
        }
      }

      if (inputs.description) {
        rec["description"] = inputs.description.en;
        rec["description_ar"] = inputs.description.ar;
      }
      if (inputs.image) {
        //rec['image'] = await sails.helpers.aws.uploadFile(inputs.image,'products');
        rec["image"] = inputs.image.en;
        rec["image_ar"] = inputs.image.ar;
      }
      rec["is_featured"] = !_.isUndefined(inputs.is_featured)
        ? inputs.is_featured
        : false;

      try {
        var product = await Store_product.create(rec).fetch();
        if (product.id) {
          sails.log(`product created with id '${product.id}'`);
          if (
            !_.isUndefined(inputs.menu_promotion) &&
            !_.isEmpty(inputs.menu_promotion)
          ) {
            let menu_promotion = inputs.menu_promotion;
            menu_promotion.product_id = product.id;
            if (menu_promotion.extra_data) {
              menu_promotion.extra_data = JSON.stringify(
                menu_promotion.extra_data
              );
            }
            menu_promotion.expiry_time = moment(
              menu_promotion.expiry_time
            ).format("YYYY-MM-DD HH:mm:ss");
            let promotion_created = await Menu_promotion.create(
              inputs.menu_promotion
            );
            sails.log({ promotion_created: promotion_created });
          }
          return exits.success({
            status: true,
            data: product,
            message: strings[inputs.vendor.language].CREATED,
          });
        }
      } catch (err) {
        sails.log.error(`Error in creating product: ${err}`);
        return exits.serverError({
          status: false,
          message: strings[inputs.vendor.language].UNABLE_TO_CREATE,
        });
      }
    }
  },
};
