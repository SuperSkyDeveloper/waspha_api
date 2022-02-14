module.exports = {
  friendlyName: "Get category timeout",

  description: "",

  inputs: {
    id: {
      type: "number",
      required: true,
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    sails.log("action super-admin/get-category-timeout started");
    let data = {};
    try {
      let timeouts = await Category_timeout.find({
        category: inputs.id,
      }).populate("category");
      category = timeouts[0].category;
      data.id = inputs.id;
      data.category_name = category.en;
      for (timeout of timeouts) {
        data[`expiry_time${timeout.country}`] = timeout.expiry_time;
      }
    } catch (err) {
      sails.log.error(
        `Error in action super-admin/get-category-timeout. ${err}`
      );
    }
    sails.log("action super-admin/get-category-timeout ended");
    return exits.success({
      status: true,
      message: "",
      data: data,
    });
  },
};
