module.exports = {
  friendlyName: "Edit category timeouts",

  description: "",

  inputs: {
    id: {
      type: "number",
      required: false,
    },
    category_id: {
      type: "number",
      required: false,
    },
    data: {
      type: "json",
      required: true,
    },
  },

  exits: {
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
    invalidRequest: {
      description: "Send invalidRequest response",
      responseType: "invalidRequest",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action super-admin/edit-category-timeouts started");
    let category_id = inputs.category_id || inputs.id;
    let input_data = JSON.parse(inputs.data);

    try {
      let exist = await Category.findOne({
        id: category_id,
        deletedAt: null,
      });
      if (!exist) {
        return exits.invalidRequest({
          status: false,
          message: "Invalid category id",
          data: null,
        });
      }

      let obj = { category: category_id };
      let all_rec = [];

      for (var key in input_data) {
        if (input_data.hasOwnProperty(key)) {
          obj.country = key.match(/\d+/g)[0];
          let actual_key = key.replace(obj.country, "");
          obj[actual_key] = input_data[key];
          //  var created = await Category_timeout.create(obj).fetch();
          await Category_timeout.updateOrCreate(
            { category: category_id, country: obj.country },
            obj
          );
        }
      }
      sails.log("calling action super-admin/edit-category-timeouts ended");
      return exits.success({
        status: true,
        message: "Created successfully",
        data: { id: category_id },
      });
    } catch (err) {
      sails.log(`Error in action super-admin/edit-category-timeouts. ${err}`);
      return exits.ok({
        status: false,
        message: "Unable to create",
      });
    }
  },
};
