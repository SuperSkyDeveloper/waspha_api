const moment = require("moment");

module.exports = {
  friendlyName: "Delete drivers",

  description: "",

  inputs: {},

  exits: {
    invalidRequest: {
      description: "Send invalid response",
      responseType: "invalidRequest",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action super-admin/delete-drivers");

    let req = this.req;
    let filter = null;
    if (req.query.filter) {
      filter = JSON.parse(req.query.filter);
      sails.log({ filter: filter.id });
    }

    let drivers = await Driver.find({ id: filter.id });
    if (!drivers.length) {
      return exits.invalid({
        status: false,
        message: "Invalid drivers id",
        data: [],
      });
    }

    drivers = await Driver.update({ id: filter.id }).set({
      deletedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    });
    // _.filter(drivers, function () {
    //   return _.findIndex(answers, {'question_id': question.id}) === -1;
    // });
    return exits.success({
      status: true,
      message: "Deleted successfully",
      data: filter.id,
    });
  },
};
