const moment = require("moment");
const expiry_time = "2020-10-20T15:00:00.000Z";
module.exports = {
  friendlyName: "Order detail",

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
    sails.log("calling action user/order-detail");

    let query = `
    SELECT u.id as user_id, u.name as user_name, u.avatar as user_avatar,u.country_code,u.contact, p.createdAt as order_date,p.proposal_selection_time,p.status_id AS p_status_id,rfp_store.id as rfp_store_id,rfp_store.status_id,
    rfp.id as rfp_id,rfp.delivery_location,rfp.lat,rfp.lng,rfp.landmark,rfp.createdAt as order_placed,rfp.type,
    p.id as proposal_id,p.delivery_mode_id,
    p.createdAt AS proposal_date,p.delivery_fee,p.rfp_store_id,p.promo_code_id,
    p.delivery_vehicle_id,p.type,s.id as store_id,s.business_name AS store_name,s.image AS store_image,s.lat as store_lat,s.lng as store_lng,s.address as store_address,s.timings AS store_timings,
    c.id as cat_id, c.name AS cat_name,c.image AS cat_image, st.slug AS status
    FROM users u
    INNER JOIN request_for_proposals rfp ON u.id = rfp.user_id
    INNER JOIN request_for_proposal_store rfp_store ON rfp.id = rfp_store.rfp_id
    INNER JOIN proposals p ON rfp_store.id = p.rfp_store_id    
    INNER JOIN statuses st ON st.id = p.status_id
    INNER JOIN stores s ON rfp_store.store_id = s.id
    LEFT JOIN delivery_modes dm ON dm.id = p.delivery_mode_id
    LEFT JOIN categories c ON c.id = s.category_id
    WHERE p.id = ${inputs.id}       
    `;
    try {
      var statuses = await sails.helpers.getAllStatuses();

      const result = await sails.sendNativeQuery(query);
      if (result.rows.length) {
        const order = result.rows[0];
        sails.log(order);
        const items = await Proposal_item.find({
          where: { proposal_id: order.proposal_id },
          select: [
            "id",
            "title",
            "price",
            "quantity",
            "tax_ratio",
            "requirements",
            "remarks",
            "image",
          ],
        }).populate("product_id");

        const dm = await Delivery_mode.findOne({ id: order.delivery_mode_id });

        var data = {};
        data["id"] = order.proposal_id;
        data["order_date"] = order.proposal_date;
        data["status"] = await sails.helpers.getObjectKeyByValue(
          statuses,
          order.p_status_id
        );
        let timings = order.store_timings;
        if (order.store_timings === "custom") {
          timings = await Store_timing.find({
            where: { store_id: order.store_id },
            select: ["day", "from", "to"],
          });

          if (timings.length) {
            timings = await sails.helpers.formatStoreTimings(
              timings,
              inputs.user.language
            );
          }
        }

        data["store"] = {
          id: order.store_id,
          name: order.store_name,
          image: order.store_image,
          distance: parseFloat(
            (
              await sails.helpers.getDistance(
                { lat: inputs.location.lat, lng: inputs.location.lng },
                { lat: order.store_lat, lng: order.store_lng }
              )
            ).toFixed(2)
          ),
          rating: await sails.helpers.getStoreAvgRating(order.store_id),
          category: {
            // id: order.cat_id,
            // name: order.cat_name,
            // image: order.cat_image,
          },
          timings: timings,
        };
        cat = await Store_subcategory.find({ store_id: order.store_id })
          .populate("subcategory_id")
          .limit(1)
          .sort("id ASC");
        data["store"].category = {
          id: cat[0].subcategory_id.id,
          name: {
            en: cat[0].subcategory_id.en,
            ar: cat[0].subcategory_id.ar,
          },
          image: cat[0].subcategory_id.image,
        };
        data["delivery_location"] = {
          address: order.delivery_location,
          lat: order.lat,
          lng: order.lng,
        };

        data["landmark"] = order.landmark;
        data["type"] = order.type;
        data["expiry_time"] = expiry_time;
        data["expiry_time"] = moment(order.proposal_date)
          .add(
            parseInt(
              order.proposal_selection_time || process.env.EXPIRY_TIME_PROPOSAL
            ),
            "minutes"
          )
          .toISOString(); //will be fetched from admin panel later;

        data["delivery_mode_id"] = order.delivery_mode_id;

        data["delivery_vehicle_id"] = order.delivery_vehicle_id;

        var user = {};
        user["id"] = order.user_id;
        user["name"] = order.user_name;
        user["avatar"] = order.user_avatar;
        user["contact"] = order.country_code + order.contact;

        data["user"] = user;

        sum = 0;

        let wasphaFeeObj = await sails.helpers.getWasphaFee(
          order.rfp_store_id,
          order.type
        );

        if (order.promo_code_id) {
          let subtotal = await sails.helpers.getSubtotal(items);
          let commission_on_subtotal =
            wasphaFeeObj.wasphaFeeType == "fixed"
              ? wasphaFeeObj.wasphaFee
              : (subtotal * wasphaFeeObj.wasphaFee) / 100;
          commission_on_subtotal = await sails.helpers.fixDoubleValue(
            commission_on_subtotal,
            2
          );
          var pm_result = await sails.helpers.calculatePromoCodeDiscount(
            order.promo_code_id,
            {
              subtotal: subtotal,
              total: subtotal + order.delivery_fee + commission_on_subtotal,
              waspha_fee: commission_on_subtotal,
              delivery_fee: order.delivery_fee,
            }
          );
        }
        for (item of items) {
          if (item.product_id) {
            en_ar = inputs.user.language;
            item.title = item.product_id.title;
            if (en_ar == "ar") {
              item.title = item.product_id["title" + en_ar];
            }
          }
        }

        data.estimate_bill = await sails.helpers.getEstimateBill(
          items,
          wasphaFeeObj.wasphaFee,
          wasphaFeeObj.wasphaFeeType
        );

        data.total = data.estimate_bill.total;
        if (order.type == global.RFP_TYPE.DELIVERY) {
          data.total += order.delivery_fee;
        }
        data.estimate_bill = data.estimate_bill.sum;
        if (!_.isUndefined(pm_result) && !_.isEmpty(pm_result)) {
          data.total -= pm_result.discount;
        }

        data["items"] = items;

        if (order.status_id == statuses.cancelled) {
          var cancellation_reasons = {};
          var reason1 = {
            id: 1,
            value: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
          };
          var reason2 = {
            id: 2,
            value: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
          };
          var reason3 = {
            id: 3,
            value: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
          };
          var arr = [];
          arr.push(reason1);
          arr.push(reason2);
          arr.push(reason3);
          cancellation_reasons["reasons"] = arr;
          cancellation_reasons[
            "other_reason"
          ] = `Lorem Ipsum is simply dummy text of the printing and typesetting industry`;
          data["cancellation"] = cancellation_reasons;
        } else {
          var driver = {};
          driver["id"] = 1;
          driver["name"] = "abc";
          driver["avatar"] =
            "https://waspha.s3.amazonaws.com/driver/LfiBBlOz3Q.png";
          driver["vehicle_icon"] =
            "https://waspha.s3.amazonaws.com/vehicles/Y0UWNSqjXU.png";
          driver["rating"] = 4.5;
          driver["delivery_time"] = "2020-09-14T20:00:00.000Z";
          driver["items_received"] = await sails.helpers.getProposalDescription(
            order,
            inputs.user.language
          );
          data["driver"] = driver;

          data["order_flow"] = await sails.helpers.getOrderStatus(
            order.proposal_id,
            order.type,
            inputs.user.language
          );
        }

        return exits.success({
          status: true,
          message: sails.config.strings[inputs.user.language].ORDER_FOUND,
          data: data,
        });
      }
      return exits.ok({
        status: false,
        message: sails.config.strings[inputs.user.language].ORDER_NOT_FOUND,
        data: [],
      });
    } catch (err) {
      sails.log.error(
        `Error fetching order detail for proposal_id ${inputs.id}, Error: ${err}`
      );
      return exits.serverError({
        status: false,
        message: sails.config.strings[inputs.user.language].ORDER_NOT_FOUND,
      });
    }
  },
};
