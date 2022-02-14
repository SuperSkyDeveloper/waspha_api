module.exports = {
  friendlyName: "Get store product",

  description: "",

  inputs: {
    id: {
      type: "number",
      required: true,
    },
  },

  exits: {
    notFound: {
      responseType: "notFound",
      description: "Send notFound response",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action admin/get-store-product");
    const store_product = await Store_product.findOne({
      where: { id: inputs.id },
      // select: [
      //   "id",
      //   "name",
      //   "slug",
      //   "en",
      //   "ar",
      //   "image",
      //   "secondary_image",
      //   "description",
      //   "createdAt",
      // ],
    }).populate("category_id");
    if (store_product) {
      store_product.name = {
        en: store_product.en,
        ar: store_product.ar,
      };

      if (store_product.category_id) {
        store_product.category = store_product.category_id;
        store_product.category_id = store_product.category.id;
        store_product.category.display_name =
          store_product.category.name || store_product.category.name_ar;
      }

      return exits.success({
        status: true,
        message: "store_product found successfully",
        data: store_product,
      });
    }
    return exits.notFound({
      status: false,
      message: "Not found",
      data: [],
    });
  },
};
