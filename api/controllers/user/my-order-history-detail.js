const moment = require("moment");
module.exports = {
  friendlyName: "My order history detail",

  description: "",

  inputs: {
    user: {
      type: "ref",
      required: true,
      description: "logged in user",
    },
    proposal_id: {
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
    sails.log("calling action user/my-order-history-detail");
    let query = `
    SELECT u.id as user_id, u.name as user_name, u.avatar as user_avatar,u.country_code,u.contact, p.createdAt as order_date,p.proposal_selection_time,rfp_store.id as rfp_store_id,rfp_store.status_id,
    rfp.id as rfp_id,rfp.delivery_location,rfp.lat,rfp.lng,rfp.landmark,rfp.createdAt as order_placed,p.id as proposal_id,p.delivery_mode_id,
    p.delivery_vehicle_id,p.type,p.eta,p.is_read,s.id AS s_id,s.business_name AS s_name,s.address AS s_address,s.lat AS s_lat,s.lng AS s_lng,s.timings AS s_timings,s.image AS s_image,
    v.id AS v_id,v.name AS v_name, c.id as c_id, c.en AS c_en,c.ar AS c_ar,c.image AS c_image
    FROM users u
    INNER JOIN request_for_proposals rfp ON u.id = rfp.user_id
    INNER JOIN request_for_proposal_store rfp_store ON rfp.id = rfp_store.rfp_id
    INNER JOIN stores s ON rfp_store.store_id = s.id
    INNER JOIN vendors v ON v.id = s.vendor_id
    INNER JOIN proposals p ON rfp_store.id = p.rfp_store_id    
    LEFT JOIN delivery_modes dm ON dm.id = p.delivery_mode_id
    LEFT JOIN categories c ON c.id = rfp.subcategory_id
    WHERE p.id = ${inputs.proposal_id}       
    `;
    // console.log(query);
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
      var p = result.rows[0];

      var proposal = { proposal_id: p.proposal_id };

      proposal.is_read = p.is_read == 1 ? true : false;
      if (p.is_read == false) {
        proposal.is_read = true;
        await Proposal.updateOne({ id: p.proposal_id }).set({
          is_read: proposal.is_read,
        });
      }
      const expiry_minutes =
        p.proposal_selection_time || process.env.EXPIRY_TIME_PROPOSAL;
      proposal.expiry_time = moment(p.order_date).add(
        expiry_minutes,
        "minutes"
      );
      proposal.eta = p.eta;
      proposal.order_date = p.order_date;
      //proposal.type = p.type;
      //proposal.estimate_bill = null;
      proposal.category = {
        id: p.c_id,
        name: { en: p.c_en, ar: p.c_ar },
        image: p.c_image,
      };
      proposal.delivery_location = {
        address: p.delivery_location,
        lat: p.lat,
        lng: p.lng,
      };
      var items = await Proposal_item.find({
        where: { proposal_id: p.proposal_id },
        select: [
          "title",
          "price",
          "quantity",
          "tax_ratio",
          "image",
          "requirements",
          "remarks",
        ],
      }).populate("product_id");
      if (items.length) {
        //proposal.estimate_bill = await sails.helpers.getEstimateBill(items);
        // proposal.estimate_bill = proposal.estimate_bill.sum;
        // items = items.map(function (o) {
        //   return Object.assign(
        //     {
        //       name: o.title,
        //       description: o.requirements,
        //     },
        //     _.omit(o, "title", "requirements")
        //   );
        // });
        for (item of items) {
          item.name = item.title;
          item.description = item.requirements;
          delete item.title;
          delete item.requirements;
          if (item.product_id) {
            item.name = {
              en: item.product_id.title,
              ar: item.product_id.title_ar,
            };
            item.image = {
              en: item.product_id.image,
              ar: item.product_id.image_ar,
            };
            item.description = {
              en: item.product_id.description,
              ar: item.product_id.description_ar,
            };
            // item.menu_promotion = await sails.helpers.getMenuPromotion(
            //   item.product_id.id,
            //   menu_promotions
            // );
            sails.log({ yes: item });
            item.product_id = item.product_id.id;
          }

          sails.log({ item: item });
        }
      }
      var store = {};
      store.vendor = {
        id: p.v_id,
        name: p.v_name,
      };
      store.id = p.s_id;
      store.name = p.s_name;
      store.image = p.s_image;
      store.location = {
        address: p.s_address,
        lat: p.s_lat,
        lng: p.s_lng,
      };
      store.avg_rating = await sails.helpers.getStoreAvgRating(p.s_id);
      // store.distance = await sails.helpers.getDistance({lat: inputs.location.lat, lng: inputs.location.lng},{lat: p.s_lat, lng: p.s_lng});
      // store.timings = p.s_timings;
      // if(store.timings === 'custom'){
      //   var timings = await Store_timing.find({store_id: p.s_id});
      //   if(timings.length){
      //     store.timings  = await sails.helpers.formatStoreTimings(timings);
      //   }
      // }
      proposal.store = store;
      proposal.items = items;

      //proposal.invoice = await sails.helpers.getProposalInvoice.with({proposal_id:inputs.proposal_id,language: inputs.user.language});
      //delete proposal.invoice.proposal;
      return exits.success({
        status: true,
        message: sails.config.strings[inputs.user.language].PROPOSAL_FOUND,
        data: proposal,
      });
    } catch (err) {
      sails.log(
        `Error getting order proposal detail for Proposal id ${inputs.proposal_id}. ${err}`
      );
      return exits.serverError({
        status: false,
        message: sails.config.strings[inputs.user.language].PROPOSAL_NOT_FOUND,
        data: [],
      });
    }
  },
};
