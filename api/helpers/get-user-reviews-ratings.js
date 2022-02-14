module.exports = {
  friendlyName: "Get  reviews ratings",

  description: "",

  inputs: {
    id: {
      type: "number",
      required: true,
    },
    req_query: {
      type: "json",
      required: false,
    },
  },

  exits: {
    success: {
      outputFriendlyName: " reviews ratings",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper get-review-ratings");
    try {
      sails.log(`trying to fetch review & ratings,  id: ${inputs.id}`);

      let query = `
      SELECT urr.*,d.id AS d_id, d.name AS d_name,d.avatar ,s.id AS s_id, s.business_name AS s_name,s.ar AS s_ar,s.image
      FROM user_reviews_ratings urr
      LEFT JOIN drivers d
        ON d.id = urr.driver_id
      LEFT JOIN stores s
        ON s.id = urr.store_id
      WHERE urr.user_id = ${inputs.id}    
      `;
      if (inputs.req_query) {
        range = JSON.parse(inputs.req_query.range);

        let sort = await sails.helpers.getSortFilters(
          { query: inputs.req_query },
          true
        );
        if (sort) {
          query += ` ORDER BY urr.${sort} LIMIT ${range[0]},${
            range[1] - range[0] + 1
          }`;
        }
      } else {
        query += `  ORDER BY urr.createdAt DESC`;
      }

      let result = await sails.sendNativeQuery(query);
      if (result.rows.length > 0) {
        let data = {};
        let reviews_ratings = [];
        for (const r of result.rows) {
          let review = {};
          review.id = r.id;
          review.order_id = r.order_id;
          review.created_at = r.createdAt;
          review.review = r.review;
          review.rating = r.rating;
          let name = r.d_id
            ? r.d_name
            : {
                en: await sails.helpers.convertHtmlIntoText(r.s_name),
                ar: await sails.helpers.convertHtmlIntoText(r.s_ar),
              };
          review.reviewed_by = {
            id: r.d_id || r.s_id,
            name: name,
            image: r.avatar || r.image,
          };
          reviews_ratings.push(review);
        }
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
