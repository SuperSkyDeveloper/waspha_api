const moment = require("moment");
module.exports = {
  friendlyName: "My order proposals",

  description: "",

  inputs: {
    user: {
      type: "ref",
      required: true,
      description: "logged in user",
    },
    id: {
      type: "number",
      required: true,
    },
    location: {
      type: "json",
      required: true,
      custom: function (value) {
        return (
          _.isObject(value) &&
          //  && typeof value.address !== 'undefined'
          typeof value.lat !== "undefined" &&
          typeof value.lng !== "undefined" &&
          // && _.isString(value.address)
          _.isNumber(value.lat) &&
          _.isNumber(value.lng)
        );
      },
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
    sails.log("calling action user/my-order-proposals");
    let query = `
    SELECT u.id as user_id, u.name as user_name, u.avatar as user_avatar,u.country_code,u.contact, p.createdAt as order_date,p.proposal_selection_time,rfp_store.id as rfp_store_id,rfp_store.status_id,
    rfp.id as rfp_id,rfp.delivery_location,rfp.lat,rfp.lng,rfp.landmark,rfp.createdAt as order_placed,p.id as proposal_id,p.delivery_mode_id,
    p.delivery_vehicle_id,p.type,p.is_read,p.is_revised,p.delivery_fee,p.rfp_store_id,p.promo_code_id,s.id AS s_id,s.business_name AS s_name,s.address AS s_address,s.lat AS s_lat,s.lng AS s_lng,s.timings AS s_timings,s.image AS s_image,
    st.slug AS status,
    ROUND(ST_DISTANCE_SPHERE(s.location_coordinates, rfp.location_coordinates)/1000) AS distance,
    (SELECT SUM(i.price*i.quantity +(i.price*i.tax_ratio/100)*i.quantity) FROM proposal_items i WHERE i.proposal_id = p.id) AS total,
    (SELECT AVG(rating) from store_reviews_ratings WHERE store_id = s.id) AS rating
    FROM users u
    INNER JOIN request_for_proposals rfp 
      ON u.id = rfp.user_id
    INNER JOIN request_for_proposal_store rfp_store 
      ON rfp.id = rfp_store.rfp_id
    INNER JOIN stores s 
      ON rfp_store.store_id = s.id
    INNER JOIN proposals p 
      ON rfp_store.id = p.rfp_store_id    
    INNER JOIN statuses st 
      ON st.id = p.status_id
    LEFT JOIN delivery_modes dm 
      ON dm.id = p.delivery_mode_id
    WHERE rfp_store.rfp_id = ${inputs.id}   
    AND st.slug NOT IN  ('${global.STATUS.REJECTED}')    
    `;
    //sails.log(query);
    try {
      let result = await sails.sendNativeQuery(query);
      if (!result.rows.length) {
        return exits.ok({
          status: false,
          message:
            sails.config.strings[inputs.user.language].PROPOSALS_NOT_FOUND,
          data: [],
        });
      }
      let all_proposals = [];
      let min_distance = result.rows[0].distance;
      let min_total = result.rows[0].total;
      let max_rating = result.rows[0].rating;
      let nearest = 0;
      let cheapest = 0;
      let most_rated = 0;
      let proposals = result.rows;

      for (i = 0; i < proposals.length; i++) {
        let proposal = {};
        if (proposals[i].distance < min_distance) {
          nearest = i;
        }
        if (proposals[i].total < min_total) {
          cheapest = i;
        }
        if (proposals[i].rating > max_rating) {
          most_rated = i;
        }
        proposal.filter = {
          is_nearest: false,
          is_cheapest: false,
          most_rated: false,
        };
        proposal.proposal_id = proposals[i].proposal_id;
        // proposal.expiry_time = parseInt(process.env.EXPIRY_TIME);//will be fetched from admin panel later
        proposal.expiry_time = moment(proposals[i].order_date)
          .add(
            parseInt(
              proposals[i].proposal_selection_time ||
                process.env.EXPIRY_TIME_PROPOSAL
            ),
            "minutes"
          )
          .toISOString(); //will be fetched from admin panel later
        proposal.is_read = proposals[i].is_read == 1 ? true : false;
        proposal.order_date = proposals[i].order_date;
        proposal.status = proposals[i].status;
        proposal.type = proposals[i].type;
        proposal.is_revised = proposals[i].is_revised == 1 ? true : false;
        proposal.estimate_bill = null;
        let items = await Proposal_item.find({
          where: { proposal_id: proposals[i].proposal_id },
          select: ["price", "quantity", "tax_ratio"],
        }).populate("product_id");
        if (items.length) {
          let wasphaFeeObj = await sails.helpers.getWasphaFee(
            proposals[i].rfp_store_id,
            proposals[i].type
          );
          proposal.estimate_bill = await sails.helpers.getEstimateBill(
            items,
            wasphaFeeObj.wasphaFee,
            wasphaFeeObj.wasphaFeeType
          );
          //proposal.estimate_bill = proposal.estimate_bill.sum;
          var wasphaFeeAmount = wasphaFeeObj.wasphaFee;
          if (wasphaFeeObj.wasphaFeeType == "percentage") {
            wasphaFeeAmount =
              (proposal.estimate_bill.sum * wasphaFeeObj.wasphaFee) / 100;
          }
          proposal.total =
            proposal.estimate_bill.total + proposals[i].delivery_fee;

          if (proposals[i].promo_code_id) {
            var pm_result = await sails.helpers.calculatePromoCodeDiscount(
              proposals[i].promo_code_id,
              {
                subtotal: proposal.estimate_bill.subtotal,
                total: proposal.total,
                waspha_fee: wasphaFeeAmount,
                delivery_fee: proposals[i].delivery_fee,
              }
            );
            if (!_.isUndefined(pm_result) && !_.isEmpty(pm_result)) {
              proposal.total -= pm_result.discount;
            }
          }
          proposal.estimate_bill = proposal.estimate_bill.sum;
        }
        let store = {};

        store.name = proposals[i].s_name;
        store.image = proposals[i].s_image;
        store.location = {
          address: proposals[i].s_address,
          lat: proposals[i].s_lat,
          lng: proposals[i].s_lng,
        };
        // store.avg_rating = await sails.helpers.getStoreAvgRating(proposals[i].s_id);
        store.avg_rating = proposals[i].rating;
        store.distance = proposals[i].distance;
        //store.distance = await sails.helpers.getDistance({lat: inputs.location.lat, lng: inputs.location.lng},{lat: proposals[i].s_lat, lng: proposals[i].s_lng});
        store.timings = proposals[i].s_timings;
        if (store.timings === "custom") {
          let timings = await Store_timing.find({
            store_id: proposals[i].s_id,
          });
          if (timings.length) {
            store.timings = await sails.helpers.formatStoreTimings(
              timings,
              inputs.user.language
            );
          }
        }
        proposal.store = store;
        all_proposals.push(proposal);
      }
      all_proposals[nearest].filter.is_nearest = true;
      all_proposals[cheapest].filter.is_cheapest = true;
      all_proposals[most_rated].filter.most_rated = true;
      return exits.success({
        status: true,
        message: sails.config.strings[
          inputs.user.language
        ].PROPOSALS_FOUND.replace("{total}", all_proposals.length),
        data: all_proposals,
      });
    } catch (err) {
      sails.log(
        `Error getting order proposals for RFP id ${inputs.id}. ${err}`
      );
      return exits.serverError({
        status: false,
        message: sails.config.strings[inputs.user.language].PROPOSALS_NOT_FOUND,
        data: [],
      });
    }
  },
};
