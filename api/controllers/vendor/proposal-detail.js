const moment = require("moment");
// const { convert } = require("html-to-text");

module.exports = {
  friendlyName: "Order detail",

  description: "",

  inputs: {
    vendor: {
      type: "ref",
      required: true,
      description: "logged in vendor",
    },
    id: {
      type: "number",
      required: true,
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
    sails.log("calling action vendor/order-detail");

    let query = `
    SELECT u.id as user_id, u.name as user_name, u.avatar as user_avatar,u.country_code,u.contact,u.rc_id,u.rc_username, 
    p.createdAt as order_date,p.proposal_selection_time,rfp_store.id as rfp_store_id,rfp_store.status_id,
    rfp.id as rfp_id,rfp.delivery_location,rfp.lat,rfp.lng,rfp.landmark,rfp.createdAt as order_placed,rfp.type,
    p.id as proposal_id,p.delivery_mode_id,
    p.delivery_vehicle_id,p.type,p.is_revised,s.slug as status,p.proposal_prep_time,os.order_accepted,p.eta,p.delivery_fee,
    p.promo_code_id,p.order_type,p.package_charges
    FROM users u
    INNER JOIN request_for_proposals rfp ON u.id = rfp.user_id
    INNER JOIN request_for_proposal_store rfp_store ON rfp.id = rfp_store.rfp_id
    INNER JOIN proposals p ON rfp_store.id = p.rfp_store_id    
    INNER JOIN statuses s ON p.status_id = s.id
    LEFT JOIN delivery_modes dm ON dm.id = p.delivery_mode_id
    LEFT JOIN order_statuses os ON os.proposal_id = p.id
    WHERE p.id = ${inputs.id}     
    AND rfp_store.store_id = ${inputs.vendor.store.id}  
    `;
    sails.log(query);
    try {
      var statuses = await sails.helpers.getAllStatuses();

      var result = await sails.sendNativeQuery(query);
      if (!result.rows.length) {
        query = ` 
        SELECT NULL AS user_id, NULL AS user_name, NULL AS user_avatar,NULL AS country_code,NULL AS contact,NULL AS rc_id,NULL AS rc_username, 
        p.createdAt AS order_date,p.proposal_selection_time,NULL AS rfp_store_id,NULL status_id,
        NULL AS rfp_id,p.delivery_location, NULL AS lat, NULL AS lng,NULL AS landmark,p.createdAt AS order_placed,p.type,
        p.id AS proposal_id,p.delivery_mode_id,
        p.delivery_vehicle_id,p.type,p.is_revised,s.slug AS status,p.proposal_prep_time,os.order_accepted,p.eta,p.delivery_fee,
        p.promo_code_id,p.order_type,p.package_charges
        FROM proposals p   
        INNER JOIN statuses s ON p.status_id = s.id
        LEFT JOIN delivery_modes dm ON dm.id = p.delivery_mode_id
        LEFT JOIN order_statuses os ON os.proposal_id = p.id
        WHERE p.id = ${inputs.id}     
        AND p.store_id = ${inputs.vendor.store.id} `;
        result = await sails.sendNativeQuery(query);
      }
      if (result.rows.length) {
        const order = result.rows[0];

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
        data["status"] = order.status;
        data["order_type"] = order.order_type;
        sails.log(inputs.vendor.store);
        if (order.status == global.STATUS.ACCEPTED) {
          data["order_accepted"] = order.order_accepted;
          data["proposal_prep_time"] =
            order.proposal_prep_time || inputs.vendor.store.proposal_prep_time;
        }
        data["request_code"] = order.rfp_id;

        data["store_location"] = {
          address: inputs.vendor.store.address,
          lat: inputs.vendor.store.lat,
          lng: inputs.vendor.store.lng,
        };
        data["delivery_location"] =
          order.order_type == global.ORDER_TYPE.NORMAL
            ? {
                address: order.delivery_location,
                lat: order.lat,
                lng: order.lng,
              }
            : JSON.parse(order.delivery_location);

        data["landmark"] = order.landmark;
        data["type"] = order.type;

        data["expiry_time"] = moment(order.order_date)
          .add(
            parseInt(
              order.proposal_selection_time || process.env.EXPIRY_TIME_PROPOSAL
            ),
            "minutes"
          )
          .toISOString(); //will be fetched from admin panel later;;

        // var delivery_mode = {};
        // delivery_mode['id'] = dm.id;
        // delivery_mode['name'] = dm.name;
        // delivery_mode['title'] = dm.title;
        // delivery_mode['subtitle'] = dm.subtitle;
        // delivery_mode['image'] = dm.image;
        data["delivery_mode_id"] = order.delivery_mode_id;

        data["delivery_vehicle_id"] = order.delivery_vehicle_id;
        // if(order.delivery_vehicle_id){
        //   const dv = await Delivery_vehicle.findOne({id: order.delivery_vehicle_id});
        //   var delivery_vehicle = {};
        //   delivery_vehicle['id'] = dv.id;
        //   delivery_vehicle['name'] = dv.name;
        //   delivery_vehicle['title'] = dv.title;
        //   delivery_vehicle['subtitle'] = dv.subtitle;
        //   delivery_vehicle['image'] = {white: dv.image,color: dv.color_image};
        //   //data['delivery_vehicle'] = delivery_vehicle;
        // }

        var user = {};
        user["id"] = order.user_id;
        user["name"] = order.user_name;
        user["avatar"] = order.user_avatar;
        user["rc_id"] = order.rc_id;
        user["rc_username"] = order.rc_username;
        user["contact"] = order.country_code + order.contact;

        data["user"] = user;

        var items_received = "";
        sum = 0;
        sails.log({ item11111: items[0] });

        for (item of items) {
          // title = convert(item.title, {
          //   wordwrap: 130,
          // });
          title = item.title;
          items_received += title + ", ";
          item.name = title;
          item.description = item.requirements;
          delete item.title;
          delete item.requirements;
          delete item.proposal_id;

          var tax = ((item.price * item.tax_ratio) / 100) * item.quantity;

          sum = sum + item.price * item.quantity + tax;

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
            //item.product_id = item.product_id.id;
          }
        }
        wasphaFeeObj = {
          wasphaFee: 0,
          wasphaFeeType: global.FEE_TYPE.FIXED,
        };
        if (order.rfp_store_id) {
          wasphaFeeObj = await sails.helpers.getWasphaFee(
            order.rfp_store_id,
            order.type
          );
        }
        data.estimate_bill = await sails.helpers.getEstimateBill(
          items,
          wasphaFeeObj.wasphaFee,
          wasphaFeeObj.wasphaFeeType,
          order.package_charges
        );
        data.total = data.estimate_bill.total;
        if (order.type == global.RFP_TYPE.DELIVERY) {
          if (order.delivery_mode_id == 3 && !order.delivery_fee) {
            order.delivery_fee = await sails.helpers.getProposalEstimateDeliveryFee(
              order.proposal_id
            );
          }
          data.total += order.delivery_fee;
        }

        data.estimate_bill = data.estimate_bill.sum;
        data.estimate_bill = await sails.helpers.fixDoubleValue(
          data.estimate_bill
        );
        data["items"] = items;

        if (order.promo_code_id) {
          let commission_on_subtotal =
            wasphaFeeObj.wasphaFeeType == global.FEE_TYPE.FIXED
              ? wasphaFeeObj.wasphaFee
              : (sum * wasphaFeeObj.wasphaFee) / 100;
          commission_on_subtotal = await sails.helpers.fixDoubleValue(
            commission_on_subtotal,
            2
          );
          var pm_result = await sails.helpers.calculatePromoCodeDiscount(
            order.promo_code_id,
            {
              subtotal: sum,
              total: sum + order.delivery_fee + commission_on_subtotal,
              waspha_fee: commission_on_subtotal,
              delivery_fee: order.delivery_fee,
            }
          );
          if (!_.isUndefined(pm_result) && !_.isEmpty(pm_result)) {
            data.total -= pm_result.discount;
            data.estimate_bill -= pm_result.discount;
          }
        }
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
          query = `
            SELECT d.*,pd.createdAt AS request_time FROM drivers d
            INNER JOIN proposal_driver pd
              ON pd.driver_id = d.id
            WHERE 
              pd.proposal_id = ${order.proposal_id}
              AND 
              (pd.status_id IN (${statuses.pending},${statuses.accepted},${statuses.completed},${statuses.at_pickup},${statuses.picked_up},${statuses.delivery_started},
                ${statuses.at_delivery},${statuses.delivery_confirmed},${statuses.payment_received})
                OR (d.type = '${global.DRIVER_TYPE.OFFLINE}' AND pd.status_id != ${statuses.expired})
              )       
              ORDER BY pd.createdAt DESC
              LIMIT 1     
          `;
          sails.log(query);
          result = await sails.sendNativeQuery(query);
          var assigned_driver = result.rows.length > 0 ? result.rows[0] : null;
          data["driver"] = null;
          if (order.type == global.RFP_TYPE.DELIVERY) {
            var driver = null;
            if (assigned_driver) {
              let dm = await sails.helpers.getDeliveryModes();

              driver = {};
              driver["id"] = assigned_driver.id;
              driver["name"] = assigned_driver.name;
              driver["contact"] =
                assigned_driver.country_code + assigned_driver.contact;
              driver["avatar"] = assigned_driver.avatar;
              driver["rc_id"] = assigned_driver.rc_id;
              driver["rc_username"] = assigned_driver.rc_username;
              driver["delivery_mode_id"] = dm[assigned_driver.type];
              driver["vehicle_id"] = assigned_driver.vehicle_id;
              driver[
                "average_rating"
              ] = await sails.helpers.general.getAvgRating(
                assigned_driver.id,
                global.ROLE.DRIVER
              );
              driver["location"] = {
                address: assigned_driver.address,
                lat: assigned_driver.lat,
                lng: assigned_driver.lng,
              };

              driver["delivery_time"] = order.eta;
              if (!order.eta) {
                driver["delivery_time"] = moment(
                  assigned_driver.request_time
                ).add(60, "minutes");
              }
              driver["task_eta"] = await sails.helpers.getEta(inputs.id);

              driver[
                "items_received"
              ] = await sails.helpers.getProposalDescriptionDriver(
                order,
                inputs.vendor.language
              );
            } else {
              // driver['id'] =  1;
              // driver['name'] =  'abc';
              // driver['avatar'] = 'https://waspha.s3.amazonaws.com/driver/LfiBBlOz3Q.png';
              // driver['vehicle_id'] = 1;
            }

            // driver['vehicle_icon'] = 'https://waspha.s3.amazonaws.com/vehicles/Y0UWNSqjXU.png';
            // driver['rating'] = 4.5;
            // driver['delivery_time'] = '2020-09-14T20:00:00.000Z'
            data["driver"] = driver;
          }

          data["order_flow"] = await sails.helpers.getOrderStatus(
            order.proposal_id,
            order.type,
            inputs.vendor.language
          );
          data["is_revised"] = order.is_revised == 1 ? true : false;
          data["revised_items"] = null;
          if (order.is_revised == 1) {
            data["revised_items"] = await Proposal_revised_item.find({
              where: { proposal_item_id: _.map(data["items"], "id") },
              select: [
                "proposal_item_id",
                "quantity",
                "remarks",
                "remarks_image",
              ],
            });

            data["revised_items"].forEach(function (item) {
              item.revised_quantity = item.quantity;
              item.id = item.proposal_item_id;
              delete item.proposal_item_id;
              delete item.quantity;
            });
          }
        }

        let available_vehicles = {
          online: [],
          offline: [],
          waspha_express: [],
        };
        let online_vehicles = await Driver.find({
          store_id: inputs.vendor.store.id,
          type: global.DRIVER_TYPE.ONLINE,
          is_online: 1,
          deletedAt: null,
        });
        let offline_vehicles = await Driver.find({
          store_id: inputs.vendor.store.id,
          type: global.DRIVER_TYPE.OFFLINE,
          deletedAt: null,
        });
        let waspha_express_vehicles = await Driver.find({
          type: global.DRIVER_TYPE.WASPHA_EXPRESS,
          is_online: 1,
          deletedAt: null,
        });
        if (online_vehicles.length) {
          available_vehicles.online = _.unique(
            _.map(online_vehicles, "vehicle_id")
          );
        }
        if (offline_vehicles.length) {
          available_vehicles.offline = _.unique(
            _.map(offline_vehicles, "vehicle_id")
          );
        }
        if (waspha_express_vehicles.length) {
          available_vehicles.waspha_express = _.unique(
            _.map(waspha_express_vehicles, "vehicle_id")
          );
        }
        data.available_vehicles = available_vehicles;
        return exits.success({
          status: true,
          message: sails.config.strings[inputs.vendor.language].PROPOSAL_FOUND,
          data: data,
        });
      }
      return exits.ok({
        status: false,
        message:
          sails.config.strings[inputs.vendor.language].INVALID_PROPOSAL_ID,
        data: [],
      });
    } catch (err) {
      sails.log.error(
        `Error fetching order detail for proposal_id ${inputs.id}, Error: ${err}`
      );
      return exits.serverError({
        status: false,
        message:
          sails.config.strings[inputs.vendor.language].PROPOSAL_NOT_FOUND,
      });
    }
  },
};
