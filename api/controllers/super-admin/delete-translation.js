const moment = require("moment");

module.exports = {
  friendlyName: "Delete translation",

  description: "",

  inputs: {
    id: {
      type: "number",
      required: true,
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    sails.log("calling action super-admin/delete-translation");
    let translation = await Waspha_translation_all.findOne({ id: inputs.id });
    if (!translation) {
      return exits.invalid({
        status: false,
        message: "Invalid translation id",
        data: [],
      });
    }

    translation = await Waspha_translation_all.destroy({ id: inputs.id });
    return exits.success({
      status: true,
      message: "Deleted successfully",
      data: [],
    });
  },
};
