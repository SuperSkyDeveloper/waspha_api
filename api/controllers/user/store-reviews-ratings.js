module.exports = {
  friendlyName: "Store reviews ratings",

  description: "",

  inputs: {
    language: {
      type: "string",
      required: false,
      defaultsTo: "en",
    },
    store_id: {
      type: "number",
      required: true,
    },
  },

  exits: {
    serverError: {
      description: "send server error",
      responseType: "serverError",
    },
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action user/store-reviews-ratings");

    data = await sails.helpers.getStoreReviewsRatings(inputs.store_id);

    if (data !== false) {
      sails.log(
        `${data.reviews_ratings.length} reviews found for store id ${inputs.store_id}`
      );
      return exits.success({
        status: true,
        message: sails.config.strings[inputs.language].REVIEWS_FOUND.replace(
          "{total}",
          data.reviews_ratings.length
        ),
        data: data,
      });
    }
    return exits.ok({
      status: false,
      message: sails.config.strings[inputs.language].REVIEW_NOT_FOUND,
      data: [],
    });
  },
};
