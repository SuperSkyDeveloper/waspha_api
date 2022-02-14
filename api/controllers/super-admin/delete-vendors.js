const moment = require("moment");

module.exports = {
  friendlyName: "Delete vendors",

  description: "",

  inputs: {},

  exits: {
    invalidRequest: {
      description: "Send invalid response",
      responseType: "invalidRequest",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action super-admin/delete-vendors");

    let req = this.req;
    let filter = null;
    if (req.query.filter) {
      filter = JSON.parse(req.query.filter);
      sails.log({ filter: filter.id });
    }

    let stores = await Store.find({ id: filter.id });
    if (!stores.length) {
      return exits.invalid({
        status: false,
        message: "Invalid vendors id",
        data: [],
      });
    }

    let vendor_ids = _.map(stores, "vendor_id");
    stores = await Store.update({ id: filter.id }).set({
      deletedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    });
    await Vendor.update({ id: vendor_ids }).set({
      deletedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    });
    // _.filter(stores, function () {
    //   return _.findIndex(answers, {'question_id': question.id}) === -1;
    // });
    return exits.success({
      status: true,
      message: "Deleted successfully",
      data: filter.id,
    });
  },
};
