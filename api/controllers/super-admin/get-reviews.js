module.exports = {
  friendlyName: "Get reviews",

  description: "",

  inputs: {},

  exits: {
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
    notFound: {
      description: "Send notFound response",
      responseType: "notFound",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action super-admin/get-reviews");
    let reviews = [];
    try {
      let req = this.req;

      let range = [0, 9];
      if (req.query.range) {
        range = JSON.parse(req.query.range);
      }
      console.log("req.query:", req.query);
      let filter = null;
      if (req.query.filter) {
        filter = JSON.parse(req.query.filter);
      }
      let total = 0;
      switch (true) {
        case !_.isUndefined(filter.user_id): {
          reviews = await sails.helpers.getUserReviewsRatings(
            filter.user_id,
            req.query
          );
          total = await User_review_rating.count({ user_id: filter.user_id });

          //sails.log({ reviews: reviews });
          break;
        }
        case !_.isUndefined(filter.driver_id): {
          reviews = await sails.helpers.getDriverReviewsRatings(
            filter.driver_id
          );
          total = await Driver_review_rating.count({
            driver_id: filter.driver_id,
          });
          break;
        }
        case !_.isUndefined(filter.store_id): {
          reviews = await sails.helpers.getStoreReviewsRatings(filter.store_id);
          total = await Store_review_rating.count({
            store_id: filter.store_id,
          });
          //sails.log({ reviews: reviews.reviews_ratings.length });
          if (reviews.reviews_ratings.length) {
            reviews.reviews_ratings = await sails.helpers.changeKeys(
              reviews.reviews_ratings,
              {
                user: "reviewed_by",
              }
            );
          }

          break;
        }
      }
      if (!_.isEmpty(reviews)) {
        reviews = reviews.reviews_ratings;
        reviews[0].total = total;
        return exits.success({
          status: true,
          message: "",
          data: reviews,
        });
      }
      return exits.ok({
        status: false,
        message: "",
        data: [],
      });
    } catch (err) {
      sails.log.error(`Error in action super-admin/get-reviews. ${err}`);
      return exits.ok({
        status: false,
        message: "",
        data: [],
      });
    }
  },
};
