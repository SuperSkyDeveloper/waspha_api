module.exports = {
  friendlyName: "My order proposals",

  description: "",

  inputs: {
    user: {
      type: "ref",
      required: true,
      description: "logged in user",
    },
    store_id: {
      type: "number",
      required: true,
    },
    location: {
      type: "json",
      required: false,
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
    sails.log("calling action user/my-order-history");
    let query = `
    SELECT u.id as user_id, u.name as user_name, u.avatar as user_avatar,u.country_code,u.contact, p.createdAt as order_date,rfp_store.id as rfp_store_id,rfp_store.status_id,
    rfp.id as rfp_id,rfp.delivery_location,rfp.lat,rfp.lng,rfp.landmark,rfp.createdAt as order_placed,p.id as proposal_id,p.delivery_mode_id,
    p.delivery_vehicle_id,p.type,p.is_read,p.rfp_store_id,s.id AS s_id,s.business_name AS s_name,s.address AS s_address,s.lat AS s_lat,s.lng AS s_lng,s.timings AS s_timings,s.image AS s_image,
    st.slug AS status
    FROM users u
    INNER JOIN request_for_proposals rfp ON u.id = rfp.user_id
    INNER JOIN request_for_proposal_store rfp_store ON rfp.id = rfp_store.rfp_id
    INNER JOIN stores s ON rfp_store.store_id = s.id
    INNER JOIN proposals p ON rfp_store.id = p.rfp_store_id    
    INNER JOIN statuses st ON st.id = p.status_id
    LEFT JOIN delivery_modes dm ON dm.id = p.delivery_mode_id
    WHERE rfp_store.store_id = ${inputs.store_id}   
    AND rfp.user_id = ${inputs.user.id}   
    AND st.slug NOT IN  ('${global.STATUS.PENDING},${global.STATUS.REJECTED},${global.STATUS.CLOSED},${global.STATUS.EXPIRED}')   
    ORDER BY p.id DESC
    `;
    try {
      var result = await sails.sendNativeQuery(query);
      if (!result.rows.length) {
        return exits.ok({
          status: false,
          message:
            sails.config.strings[inputs.user.language].PROPOSALS_NOT_FOUND,
          data: [],
        });
      }

      var all_proposals = [];
      for (p of result.rows) {
        var proposal = {};
        proposal.proposal_id = p.proposal_id;
        //proposal.is_read = p.is_read == 1?true:false;
        proposal.order_date = p.order_date;
        //proposal.status = p.status;
        //proposal.type = p.type;
        proposal.total_amount = null;
        var items = await Proposal_item.find({
          where: { proposal_id: p.proposal_id },
          select: ["title", "price", "quantity", "tax_ratio"],
        });

        if (items.length) {
          let wasphaFeeObj = await sails.helpers.getWasphaFee(
            p.rfp_store_id,
            p.type
          );
          let total_amount = await sails.helpers.getEstimateBill(
            items,
            wasphaFeeObj.wasphaFee,
            wasphaFeeObj.wasphaFeeType
          );
          proposal.total_amount = total_amount.sum;
          proposal.description = _.map(items, "title").toString();
        }

        all_proposals.push(proposal);
      }
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
