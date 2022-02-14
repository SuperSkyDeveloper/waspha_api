module.exports = {
  friendlyName: "Get category",

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
    sails.log("calling action admin/get-category");
    const category = await Category.findOne({
      where: { id: inputs.id },
      select: [
        "id",
        "name",
        "slug",
        "en",
        "ar",
        "image",
        "secondary_image",
        "description",
        "createdAt",
      ],
    }).populate("parent_id");
    if (category) {
      category.name = {
        en: category.en,
        ar: category.ar,
      };
      category.parent = category.parent_id;
      category.parent_id = category.parent != null ? category.parent.id : null;
      return exits.success({
        status: true,
        message: "Category found successfully",
        data: category,
      });
    }
    return exits.notFound({
      status: false,
      message: "Not found",
      data: [],
    });
  },
};
