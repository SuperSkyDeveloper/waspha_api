module.exports = {
  friendlyName: "Get  reviews ratings",

  description: "",

  inputs: {
    id: {
      type: "number",
      required: true,
    },
  },

  exits: {
    success: {
      outputFriendlyName: " reviews ratings",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper get-driver-review-ratings");
    try {
      sails.log(`trying to fetch review & ratings,  id: ${inputs.id}`);
      const reviews_ratings = await Driver_review_rating.find({
        select: [
          "id",
          "review",
          "rating",
          "user_id",
          "order_id",
          "createdAt",
          "store_id",
        ],
        where: { driver_id: inputs.id },
      })
        .populate("user_id")
        .populate("store_id")
        .sort("createdAt DESC");
      if (reviews_ratings.length > 0) {
        var rating_average = await Driver_review_rating.avg("rating").where({
          driver_id: inputs.id,
        });
        let data = {};
        let user = null;
        for (const review of reviews_ratings) {
          if (review.user_id) {
            sails.log({ user_id: review.user_id });
            review.reviewed_by = {
              id: review.user_id.id,
              name: review.user_id.name,
              image: review.user_id.avatar,
            };
          } else if (review.store_id) {
            sails.log({ store_id: review.store_id });
            review.reviewed_by = {
              id: review.store_id.id,
              name: {
                en: await sails.helpers.convertHtmlIntoText(
                  review.store_id.business_name
                ),
                ar: await sails.helpers.convertHtmlIntoText(review.store_id.ar),
              },
              image: review.store_id.image,
            };
          }

          delete review.user_id;
          delete review.store_id;
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
