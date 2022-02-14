module.exports = {
  friendlyName: "Get store category",

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
    sails.log("calling action admin/get-store-category");
    const store_category = await Business_category.findOne({
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
    }).populate("parent_id");
    if (store_category) {
      if (store_category.parent_id) {
        store_category.parent = store_category.parent_id;
        store_category.parent_id = store_category.parent.id;
        store_category.parent.display_name =
          store_category.parent.name || store_category.parent.name_ar;
      }

      return exits.success({
        status: true,
        message: "store_category found successfully",
        data: store_category,
      });
    }
    return exits.notFound({
      status: false,
      message: "Not found",
      data: [],
    });
  },
};
