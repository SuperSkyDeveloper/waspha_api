const moment = require("moment");
const strings = sails.config.strings;
module.exports = {
  friendlyName: "Edit product",

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
    sails.log("calling action vendor/edit-product");
    sails.log("payload:", inputs);
    let stores = await Store.find({ vendor_id: inputs.vendor.id }).limit(1);
    if (stores[0]) {
      let products = await Store_product.find({ id: inputs.id }).limit(1);
      if (!products[0]) {
        return exits.ok({
          status: false,
          data: [],
          message: strings[inputs.vendor.language].INVALID_PRODUCT_ID,
        });
      }
      let prev_menu_promotion = await Menu_promotion.find({
        where: { product_id: products[0].id, deletedAt: null },
        select: [
          "product_id",
          "type",
          "description",
          "expiry_time",
          "extra_data",
        ],
      })
        .sort("id DESC")
        .limit(1);
      sails.log({ prev_menu_promotion: prev_menu_promotion });
      const title = inputs.title.en;
      const title_ar = inputs.title.ar;
      const rec = {
        store_id: stores[0].id,
        title: title,
        title_ar: title_ar,
        is_featured: !_.isUndefined(inputs.is_featured)
          ? inputs.is_featured
          : products[0].is_featured,
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
        } else {
          rec.category_id = null;
        }
      }
      if (inputs.description) {
        rec["description"] = inputs.description.en;
        rec["description_ar"] = inputs.description.ar;
      }
      if (inputs.image) {
        if (products[0].image) {
          let existingImagePath = products[0].image;
          let position = await sails.helpers.getCharacterPosition(
            existingImagePath,
            "/",
            3
          );
          //  await sails.helpers.aws.deleteFile( existingImagePath.substring(position+1));
        }
        // rec["image"] = await sails.helpers.aws.uploadFile(
        //   inputs.image,
        //   "products"
        // );
        rec["image"] = inputs.image.en;
        rec["image_ar"] = inputs.image.ar;
      }
      try {
        var product = await Store_product.updateOne({ id: inputs.id }).set(rec);
        if (product.id) {
          sails.log(`product updated with id '${product.id}'`);

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
            if (menu_promotion.id) {
              promotion_created = await Menu_promotion.updateOne({
                id: menu_promotion.id,
              }).set(inputs.menu_promotion);
            } else {
              promotion_created = await Menu_promotion.create(
                inputs.menu_promotion
              );
            }

            sails.log({ promotion_created: promotion_created });
          } else {
            if (prev_menu_promotion[0]) {
              await Menu_promotion.updateOne({
                id: prev_menu_promotion[0].id,
              }).set({ deletedAt: moment().format("YYYY-MM-DD HH:mm:ss") });
            }
          }

          return exits.success({
            status: true,
            data: product,
            message: strings[inputs.vendor.language].UPDATED,
          });
        }
      } catch (err) {
        sails.log.error(`Error in updating product: ${err}`);
        return exits.serverError({
          status: false,
          message: strings[inputs.vendor.language].UNABLE_TO_UPDATE,
        });
        // …
      }
    }
  },
};
