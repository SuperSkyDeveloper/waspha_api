const moment = require("moment");

module.exports = {
  friendlyName: "Delete categories",

  description: "",

  inputs: {},

  exits: {
    invalidRequest: {
      description: "Send invalid response",
      responseType: "invalidRequest",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action super-admin/delete-categories");

    let req = this.req;
    let filter = null;
    if (req.query.filter) {
      filter = JSON.parse(req.query.filter);
      sails.log({ filter: filter.id });
    }

    let categories = await Category.find({ id: filter.id });
    if (!categories.length) {
      return exits.invalid({
        status: false,
        message: "Invalid categories id",
        data: [],
      });
    }

    categories = await Category.update({ id: filter.id }).set({
      deletedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    });
    // _.filter(categories, function () {
    //   return _.findIndex(answers, {'question_id': question.id}) === -1;
    // });
    return exits.success({
      status: true,
      message: "Deleted successfully",
      data: filter.id,
    });
  },
};
