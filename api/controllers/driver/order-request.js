const { exists } = require("grunt");
const moment = require("moment");

module.exports = {
  friendlyName: "Order request",

  description: "",

  inputs: {
    driver: {
      type: "ref",
      required: true,
      description: "logged in driver",
    },
    request_id: {
      type: "number",
      required: false,
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
    sails.log("calling action driver/order-request");

    try {
      const statuses = await sails.helpers.getAllStatuses();
      let order_type = global.ORDER_TYPE.NORMAL;
      let where = {
        driver_id: inputs.driver.id,
      };

      if (!_.isUndefined(inputs.request_id)) {
        where.id = inputs.request_id;
      } else {
        where.status_id = statuses[global.STATUS.PENDING];
      }

      let pd = await Proposal_driver.find({ where: where })
        .limit(1)
        .sort("createdAt DESC")
        .populate("proposal_id");

      if (!pd.length) {
        return exits.ok({
          status: false,
          message: sails.config.strings[inputs.driver.language].NOT_FOUND,
          data: [],
        });
      }
      pd = pd[0];
      order_type = pd.proposal_id.order_type;

      if (order_type == global.ORDER_TYPE.TRADITIONAL) {
        var query = `SELECT pd.id AS request_id,pd.createdAt AS request_time,pd.code AS confirmation_code, p.id AS order_code,p.payment_method,
        p.eta,s.id AS s_id,s.business_name AS s_name,s.country_code as s_country_code,s.phone as s_contact,p.promo_code_id,p.order_type,
        s.image AS s_image,s.address AS s_address,s.lat AS s_lat, s.lng AS s_lng,v.name AS owner,v.rc_id AS s_rc_id,v.rc_username AS s_rc_username,
        u.id AS u_id, u.name AS u_name,rfp.delivery_location AS u_address, rfp.landmark AS u_landmark,u.avatar as u_avatar,
        u.country_code AS u_country_code,u.contact AS u_contact,u.rc_id AS u_rc_id,u.rc_username AS u_rc_username,
        rfp.lat AS u_lat,rfp.lng AS u_lng,c.id AS c_id, c.name AS c_name,c.ar AS c_name_ar,c.image AS c_image,
        st.slug AS status,dm.name AS delivery_mode
        
        FROM proposal_driver pd
        INNER JOIN proposals p ON p.id = pd.proposal_id
        LEFT JOIN request_for_proposal_store rfp_store ON rfp_store.id = p.rfp_store_id
        LEFT JOIN request_for_proposals rfp ON rfp.id = rfp_store.rfp_id
        LEFT JOIN categories c ON c.id = rfp.subcategory_id
        LEFT JOIN users u ON u.id = rfp.user_id
        INNER JOIN stores s ON s.id = p.store_id
        INNER JOIN vendors v ON v.id = s.vendor_id
        INNER JOIN statuses st ON st.id = pd.status_id
        LEFT JOIN delivery_modes dm ON dm.id = p.delivery_mode_id
        WHERE pd.driver_id = ${inputs.driver.id}`;
      } else {
        var query = `SELECT pd.id AS request_id,pd.createdAt AS request_time,pd.code AS confirmation_code, p.id AS order_code,p.payment_method,
        p.eta,s.id AS s_id,s.business_name AS s_name,s.country_code as s_country_code,s.phone as s_contact,p.promo_code_id,p.order_type,
        s.image AS s_image,s.address AS s_address,s.lat AS s_lat, s.lng AS s_lng,v.name AS owner,v.rc_id AS s_rc_id,v.rc_username AS s_rc_username,
        u.id AS u_id, u.name AS u_name,rfp.delivery_location AS u_address, rfp.landmark AS u_landmark,u.avatar as u_avatar,
        u.country_code AS u_country_code,u.contact AS u_contact,u.rc_id AS u_rc_id,u.rc_username AS u_rc_username,
        rfp.lat AS u_lat,rfp.lng AS u_lng,c.id AS c_id, c.name AS c_name,c.ar AS c_name_ar,c.image AS c_image,
        st.slug AS status,dm.name AS delivery_mode
        
        FROM proposal_driver pd
        INNER JOIN proposals p ON p.id = pd.proposal_id
        INNER JOIN request_for_proposal_store rfp_store ON rfp_store.id = p.rfp_store_id
        INNER JOIN request_for_proposals rfp ON rfp.id = rfp_store.rfp_id
        LEFT JOIN categories c ON c.id = rfp.subcategory_id
        INNER JOIN users u ON u.id = rfp.user_id
        INNER JOIN stores s ON s.id = rfp_store.store_id
        INNER JOIN vendors v ON v.id = s.vendor_id
        INNER JOIN statuses st ON st.id = pd.status_id
        LEFT JOIN delivery_modes dm ON dm.id = p.delivery_mode_id
        WHERE pd.driver_id = ${inputs.driver.id}     
        `;
      }

      if (!_.isUndefined(inputs.request_id)) {
        query += ` AND pd.id = ${inputs.request_id}`;
      } else {
        query += ` AND st.slug = '${global.STATUS.PENDING}'`;
      }
      sails.log(query);
      var data = {};
      var result = await sails.sendNativeQuery(query);
      if (result.rows.length) {
        var request = result.rows[0];
        data.request_id = request.request_id;
        data.delivery_mode = request.delivery_mode;
        data.request_time = request.request_time;
        data.payment_method = request.payment_method;
        data.confirmation_code = request.confirmation_code;
        data.order_type = request.order_type;
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
          language: inputs.driver.language,
        });
        if (order.invoice.proposal.pickup_location) {
          data.pickup_location = JSON.parse(
            order.invoice.proposal.pickup_location
          );
          data.delivery_location = JSON.parse(
            order.invoice.proposal.delivery_location
          );
        }
        if (request.order_type == global.ORDER_TYPE.NORMAL) {
          if (request.promo_code_id) {
            promo_code = await Promo_code.findOne({
              id: request.promo_code_id,
            });
            order.promo_code = promo_code;
            order.invoice = await sails.helpers.modifyInvoice(
              order.invoice,
              promo_code
            );
          }
          delete order.invoice.proposal;
        }
        data.orders = [order];
        data.pickup_time = moment(request.eta).add(-30, "minutes");
        data.delivery_time = request.eta;
        if (!request.eta) {
          data.pickup_time = moment(request.request_time).add(30, "minutes");
          data.delivery_time = moment(request.request_time).add(60, "minutes");
        }

        data.vendor = {};
        data.vendor.id = request.s_id;
        data.vendor.owner = request.owner;
        data.vendor.name = request.s_name;
        data.vendor.contact = request.s_country_code + request.s_contact;

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

        if (request.order_type == global.ORDER_TYPE.NORMAL) {
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
        }

        return exits.success({
          status: true,
          message:
            sails.config.strings[inputs.driver.language].ORDER_REQUEST_FOUND,
          data: data,
        });
      }
      return exits.ok({
        status: false,
        message: sails.config.strings[inputs.driver.language].NOT_FOUND,
        data: [],
      });
    } catch (err) {
      sails.log.error(
        `Error getting order request for driver id ${inputs.driver.id}. ${err}`
      );
      return exits.ok({
        status: false,
        message:
          sails.config.strings[inputs.driver.language]
            .UNABLE_TO_GET_ORDER_REQUEST,
        data: [],
      });
    }
  },
};
