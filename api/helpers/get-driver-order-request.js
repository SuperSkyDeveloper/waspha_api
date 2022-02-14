const moment = require("moment");
module.exports = {
  friendlyName: "Get driver order request",

  description: "",

  inputs: {
    id: {
      type: "number",
      required: true,
    },
    order_id: {
      type: "number",
      required: true,
    },
    statuses: {
      type: "ref",
      required: true,
    },
  },

  exits: {
    success: {
      outputFriendlyName: "Driver order request",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper general/get-driver-order-request");
    let statuses = inputs.statuses;
    let driver = await Driver.findOne(inputs.id);
    try {
      var query = `SELECT pd.id AS request_id,pd.createdAt AS request_time,pd.code AS confirmation_code, p.id AS order_code,p.payment_method,
      p.eta,s.id AS s_id,s.business_name AS s_name,p.promo_code_id,
      s.image AS s_image,s.address AS s_address,s.lat AS s_lat, s.lng AS s_lng,v.name AS owner,v.rc_id AS s_rc_id,v.rc_username AS s_rc_username,
      u.id AS u_id, u.name AS u_name,rfp.delivery_location AS u_address, rfp.landmark AS u_landmark,u.avatar as u_avatar,
      u.country_code AS u_country_code,u.contact AS u_contact,u.rc_id AS u_rc_id,u.rc_username AS u_rc_username,
      rfp.lat AS u_lat,rfp.lng AS u_lng,c.id AS c_id, c.name AS c_name,c.ar AS c_name_ar,c.image AS c_image,
      st.slug AS status
      
      FROM proposal_driver pd
      INNER JOIN proposals p ON p.id = pd.proposal_id
      INNER JOIN request_for_proposal_store rfp_store ON rfp_store.id = p.rfp_store_id
      INNER JOIN request_for_proposals rfp ON rfp.id = rfp_store.rfp_id
      LEFT JOIN categories c ON c.id = rfp.subcategory_id
      INNER JOIN users u ON u.id = rfp.user_id
      INNER JOIN stores s ON s.id = rfp_store.store_id
      INNER JOIN vendors v ON v.id = s.vendor_id
      INNER JOIN statuses st ON st.id = pd.status_id
      WHERE p.id = ${inputs.order_id}     
      AND pd.status_id IN (${statuses[global.STATUS.ACCEPTED]},${
        statuses[global.STATUS.AT_PICKUP]
      },${statuses[global.STATUS.PICKED_UP]},
      ${statuses[global.STATUS.DELIVERY_STARTED]}
      ,${statuses[global.STATUS.AT_DELIVERY]}
      ,${statuses[global.STATUS.DELIVERY_CONFIRMED]})
      `;
      if (!_.isUndefined(inputs.request_id)) {
        query += ` AND pd.id = ${inputs.request_id}`;
      } else {
        // query += ` AND p.id = ${inputs.id}`;
      }
      sails.log(query);
      var data = {};
      var result = await sails.sendNativeQuery(query);
      if (result.rows.length) {
        var request = result.rows[0];
        data.request_id = request.request_id;
        data.request_time = request.request_time;
        data.payment_method = request.payment_method;
        data.confirmation_code = request.confirmation_code;
        data.status = request.status;
        data.category = {
          id: request.c_id,
          name: { en: request.c_name, ar: request.c_name_ar },
          image: request.c_image,
        };
        data.expiry_minutes = parseInt(process.env.ORDER_REQUEST_EXIPRY_DRIVER); //will be fetched from admin panel later
        let order = { id: request.order_code };
        order.items = await sails.helpers.getProposalItems(request.order_code);

        let menu_promotions = await sails.helpers.getMenuPromotions();
        order.is_featured = false;
        for (item of order.items) {
          // item.title = item.title;
          //item.description = item.requirements;
          //delete item.title;
          delete item.requirements;
          if (item.product_id) {
            item.menu_promotion = await sails.helpers.getMenuPromotion(
              item.product_id,
              menu_promotions
            );
            if (item.menu_promotion) {
              order.is_featured = true;
            }
            sails.log({ yes: item });
          }
        }
        order.invoice = await sails.helpers.getProposalInvoice.with({
          proposal_id: order.id,
          language: driver.language,
        });
        if (request.promo_code_id) {
          promo_code = await Promo_code.findOne({ id: request.promo_code_id });
          order.promo_code = promo_code;
          order.invoice = await sails.helpers.modifyInvoice(
            order.invoice,
            promo_code
          );
        }
        delete order.invoice.proposal;
        data.orders = [order];
        data.pickup_time = moment(request.eta).add(-30, "minutes");
        data.delivery_time = request.eta;
        data.vendor = {};
        data.vendor.id = request.s_id;
        data.vendor.owner = request.owner;
        data.vendor.name = request.s_name;
        data.vendor.image = request.s_image;
        data.vendor.rc_id = request.s_rc_id;
        data.vendor.rc_username = request.s_rc_username;
        data.vendor.avg_rating = await sails.helpers.getStoreAvgRating(
          request.s_id
        );
        data.vendor.about = request.s_address;

        data.vendor.location = {
          address: request.s_address,
          lat: request.s_lat,
          lng: request.s_lng,
        };

        data.customer = {};
        data.customer.id = request.u_id;
        data.customer.name = request.u_name;
        data.customer.avatar = request.u_avatar;
        data.customer.rc_id = request.u_rc_id;
        data.customer.rc_username = request.u_rc_username;
        data.customer.avg_rating = await sails.helpers.general.getAvgRating(
          request.u_id,
          global.ROLE.USER
        );
        data.customer.about = request.u_address;
        data.customer.contact = request.u_country_code + request.u_contact;
        data.customer.location = {
          address: request.u_address,
          lat: request.u_lat,
          lng: request.u_lng,
          landmark: request.u_landmark,
        };

        return exits.success(data);
      }
      return exits.success(null);
    } catch (err) {
      sails.log.error(
        `Error in helper get-driver-order-request for driver id ${driver.id}. ${err}`
      );
      return exits.success(null);
    }
  },
};
