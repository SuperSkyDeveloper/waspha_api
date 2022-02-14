module.exports = {
  friendlyName: "Is order rated",

  description: "",

  inputs: {
    driver: {
      type: "ref",
      required: true,
      description: "logged in driver",
    },
    request_id: {
      type: "number",
      required: true,
    },
  },

  exits: {
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
    serverError: {
      description: "send server error",
      responseType: "serverError",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action driver/is-order-rated");
    let trip = await Proposal_driver.findOne({
      id: inputs.request_id,
    }).populate("status_id");
    if (!trip) {
      return exits.ok({
        status: false,
        message: sails.config.strings[inputs.driver.language].INVALID_ID,
        data: [],
      });
    }
    let is_rated = await sails.helpers.general.isOrderRated(
      inputs.driver.id,
      trip.proposal_id,
      global.ROLE.DRIVER
    );
    return exits.success({
      status: true,
      data: { is_rated: is_rated, request_status: trip.status_id.slug },
    });
  },
};
