module.exports = {
  friendlyName: "Get store reviews ratings",

  description: "",

  inputs: {
    store_id: {
      type: "number",
      required: true,
    },
  },

  exits: {
    success: {
      outputFriendlyName: "Store reviews ratings",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper get-store-review-ratings");
    try {
      sails.log(
        `trying to fetch review & ratings, store id: ${inputs.store_id}`
      );
      const reviews_ratings = await Store_review_rating.find({
        select: [
          "id",
          "review",
          "rating",
          "user_id",
          "createdAt",
          "driver_id",
          "order_id",
        ],
        where: { store_id: inputs.store_id },
      }).sort("createdAt DESC");
      if (reviews_ratings.length > 0) {
        var rating_average = await Store_review_rating.avg("rating").where({
          store_id: inputs.store_id,
        });
        let data = {};

        for (const review of reviews_ratings) {
          let user = null;
          if (review.user_id) {
            user = await User.findOne({
              where: { id: review.user_id },
              select: ["id", "name", "avatar"],
            });
          } else if (review.driver_id) {
            user = await Driver.findOne({
              where: { id: review.driver_id },
              select: ["id", "name", "avatar"],
            });
          }

          review.user = user;
          delete review.user_id;
          delete review.driver_id;
        }
        data["rating_average"] = parseFloat(rating_average.toFixed(2));
        data["reviews_ratings"] = reviews_ratings;

        return exits.success(data);
      }
      return exits.success(false);
    } catch (err) {
      sails.log.error(`Error in fetching reviews & ratings: ${err}`);
      return exits.success(false);
    }
  },
};
