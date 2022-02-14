const moment = require("moment");
module.exports = {
  friendlyName: "My order proposal detail",

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
    promo_code_id: {
      type: "number",
      required: false,
    },
    payment_method: {
      type: "string",
      required: false,
      //isIn: ['wallet','card','cash_on_delivery']
      isIn: _.values(global.PAYMENT_METHOD),
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
    sails.log("calling action user/my-order-proposal-detail");
    let query = `
    SELECT u.id as user_id, u.name as user_name, u.avatar as user_avatar,u.country_code,u.contact, p.createdAt as order_date,
    p.proposal_selection_time,p.revision_number,rfp_store.id as rfp_store_id,rfp_store.status_id,
    rfp.id as rfp_id,rfp.delivery_location,rfp.lat,rfp.lng,rfp.landmark,rfp.createdAt as order_placed,p.id as proposal_id,p.delivery_mode_id,
    p.delivery_vehicle_id,p.type,p.eta,p.is_read,p.promo_code_id,s.id AS s_id,s.business_name AS s_name,s.address AS s_address,s.lat AS s_lat,s.lng AS s_lng,s.timings AS s_timings,s.image AS s_image,
    st.slug AS status,v.id AS v_id,v.name AS v_name, c.id as c_id,c.en as c_en,c.ar as c_ar,c.image as c_image,dm.name AS delivery_mode
    FROM users u
    INNER JOIN request_for_proposals rfp ON u.id = rfp.user_id
    LEFT JOIN categories c ON c.id = rfp.subcategory_id     
    INNER JOIN request_for_proposal_store rfp_store ON rfp.id = rfp_store.rfp_id
    INNER JOIN stores s ON rfp_store.store_id = s.id
    INNER JOIN vendors v ON v.id = s.vendor_id
    INNER JOIN proposals p ON rfp_store.id = p.rfp_store_id   
    INNER JOIN statuses st 
      ON st.id = p.status_id 
    LEFT JOIN delivery_modes dm ON dm.id = p.delivery_mode_id
    WHERE p.id = ${inputs.proposal_id}       
    `;
    console.log(query);
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

      var proposal = { rfp_id: p.rfp_id, revision_number: p.revision_number };
      proposal.allowed_number_of_revisions = global.number_of_revisions;
      proposal.proposal_id = p.proposal_id;
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
      proposal.eta = p.eta || moment(p.order_date).add(60, "minutes");

      proposal.order_date = p.order_date;
      proposal.type = p.type;
      proposal.delivery_mode = p.delivery_mode;
      proposal.status = p.status;
      proposal.estimate_bill = null;
      proposal.category = {
        id: p.c_id,
        name: { en: p.c_en, ar: p.c_ar },
        image: p.c_image,
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
          "remarks_image",
          "product_id",
        ],
      }).populate("product_id");
      if (items.length) {
        let menu_promotions = await sails.helpers.getMenuPromotions();

        for (item of items) {
          item.name = item.title;
          item.description = item.requirements;
          delete item.title;
          delete item.requirements;
          if (item.product_id) {
            sails.log({ prod: item.product_id });
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
            item.menu_promotion = await sails.helpers.getMenuPromotion(
              item.product_id.id,
              menu_promotions
            );
            //item.product_id = item.product_id.id;
          }
        }

        let wasphaFeeObj = await sails.helpers.getWasphaFee(
          p.rfp_store_id,
          p.type
        );
        proposal.estimate_bill = await sails.helpers.getEstimateBill(
          items,
          wasphaFeeObj.wasphaFee,
          wasphaFeeObj.wasphaFeeType
        );
        proposal.estimate_bill = proposal.estimate_bill.sum;
      }
      //sails.log({ items111: items });
      var store = {};
      store.vendor = {
        id: p.v_id,
        name: p.v_name,
      };
      store.name = p.s_name;
      store.image = p.s_image;
      store.location = {
        address: p.s_address,
        lat: p.s_lat,
        lng: p.s_lng,
      };
      store.avg_rating = await sails.helpers.getStoreAvgRating(p.s_id);
      store.distance = await sails.helpers.getDistance(
        { lat: inputs.location.lat, lng: inputs.location.lng },
        { lat: p.s_lat, lng: p.s_lng }
      );
      store.timings = p.s_timings;
      if (store.timings === "custom") {
        var timings = await Store_timing.find({ store_id: p.s_id });
        if (timings.length) {
          store.timings = await sails.helpers.formatStoreTimings(
            timings,
            inputs.user.language
          );
        }
      }
      proposal.store = store;
      proposal.items = items;

      proposal.invoice = await sails.helpers.getProposalInvoice.with({
        proposal_id: inputs.proposal_id,
        language: inputs.user.language,
      });
      if (!_.isUndefined(inputs.promo_code_id)) {
        let response = await sails.helpers.applyPromoCode(
          inputs.user,
          inputs.proposal_id,
          inputs.payment_method,
          inputs.promo_code_id
        );
        if (response.status == false) {
          return exits.ok({
            status: false,
            message: response.message,
          });
        }

        proposal.invoice = await sails.helpers.modifyInvoice(
          proposal.invoice,
          response.promo_code
        );
      } else if (p.promo_code_id) {
        promo_code = await Promo_code.findOne({ id: p.promo_code_id });
        proposal.invoice = await sails.helpers.modifyInvoice(
          proposal.invoice,
          promo_code
        );
      }
      delete proposal.invoice.proposal;
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
