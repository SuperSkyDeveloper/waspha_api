const geolib = require("geolib");
const moment = require("moment");

module.exports = {
  friendlyName: "Assign driver to order",

  description: "",

  inputs: {
    order_id: {
      type: "number",
      required: true,
    },
    vehicle_id: {
      type: "number",
      required: true,
    },
    vendor: {
      type: "ref",
      required: false,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("helper assign-driver-to-order started");
    try {
      let order = await Proposal.findOne({ id: inputs.order_id });
      let vendor = null;
      let rfp_store = await Request_for_proposal_store.findOne({
        where: { id: order.rfp_store_id },
        select: ["store_id"],
      })
        .populate("store_id")
        .populate("rfp_id");
      if (_.isUndefined(inputs.vendor)) {
        store_id = order.store_id;
        if (!store_id) {
          store_id = rfp_store.store_id.id;
        }
        if (store_id) {
          store = await Store.findOne({
            where: { id: store_id },
          }).populate("vendor_id");
          vendor = store.vendor_id;
          delete store.vendor_id;
          vendor.store = store;
        }
      } else {
        vendor = inputs.vendor;
      }
      let pickup_location = order.pickup_location;
      let delivery_location = order.delivery_location;
      if (!delivery_location) {
        delivery_location = {
          lat: rfp_store.rfp_id.lat,
          lng: rfp_store.rfp_id.lng,
          address: rfp_store.rfp_id.delivery_location,
        };
        pickup_location = {
          lat: rfp_store.store_id.lat,
          lng: rfp_store.store_id.lng,
          address: rfp_store.store_id.address,
        };
      } else {
        pickup_location = JSON.parse(pickup_location);
        delivery_location = JSON.parse(delivery_location);
      }
      const statuses = await sails.helpers.getAllStatuses();

      let where = {
        type: global.DRIVER_TYPE.WASPHA_EXPRESS,
        is_online: true,
        vehicle_id: inputs.vehicle_id,
        status: true,
        is_zone_selected: true,
      };
      const proposal_driver = await sails.models.proposal_driver.find({
        status_id: {
          "!=": [
            statuses.completed,
            statuses.rejected,
            statuses.payment_received,
            statuses.cancelled,
            statuses.expired,
          ],
        },
        proposal_id: { "!=": inputs.order_id },
      });
      let exclude_driver_ids = [];
      const order_drivers = await sails.models.proposal_driver.find({
        proposal_id: inputs.order_id,
      });
      if (proposal_driver.length) {
        exclude_driver_ids = _.merge(
          exclude_driver_ids,
          _.map(proposal_driver, "driver_id")
        );
      }
      if (order_drivers.length) {
        exclude_driver_ids = _.merge(
          exclude_driver_ids,
          _.map(order_drivers, "driver_id")
        );
      }
      if (exclude_driver_ids.length) {
        where.id = { "!=": exclude_driver_ids };
      }
      let drivers = await Driver.find({
        where: where,
      });
      if (!drivers.length) {
        //send notification no_rider_found
      }
      for (driver of drivers) {
        let is_free_zone = false;
        switch (driver.zone_option) {
          case global.ZONE_OPTION.FREE_ZONE: {
            is_free_zone = true;

            break;
          }
          case global.ZONE_OPTION.FIXED_ZONE: {
            is_free_zone = false;
            break;
          }
          case global.ZONE_OPTION.ALL: {
            if (driver.free_zone_radius) {
              is_free_zone = true;
            }

            break;
          }
        }
        let in_range = false;
        if (is_free_zone == true) {
          // checks if driver location is within a radius of x km from delivery_location
          in_range = geolib.isPointWithinRadius(
            { latitude: driver.lat, longitude: driver.lng },
            {
              latitude: delivery_location.lat,
              longitude: delivery_location.lng,
            },
            driver.free_zone_radius * 1000
          );
        } else {
          var fixed_zone_driver = await Driver_fixed_zone.find({
            driver_id: driver.id,
          }).limit(1);
          if (fixed_zone_driver.length) {
            var fixed_zone = await Fixed_zone.findOne({
              id: fixed_zone_driver[0].fixed_zone_id,
            }).populate("latlng");
            in_range = geolib.isPointInPolygon(
              { latitude: driver.lat, longitude: driver.lng },
              fixed_zone.latlng
            );
          }
        }
        if (in_range == true) {
          //assign rider and send notification
          var random = await sails.helpers.generateRandom.with({});
          var updated = await sails.models.proposal_driver
            .create({
              proposal_id: inputs.order_id,
              driver_id: driver.id,
              code: random,
              status_id: statuses.pending,
            })
            .fetch();
          await Proposal.updateOne({ id: inputs.order_id }).set({
            delivery_vehicle_id: inputs.vehicle_id,
          });
          template = await sails.helpers.getNotificationTemplate(
            sails.config.notification.type.ORDER_REQUEST_RECEIVED
          );

          business_name = await sails.helpers.convertHtmlIntoText(
            vendor.store.business_name
          );
          let title = template.meta[driver.language];
          let body = template[driver.language].replace(
            "{vendor}",
            business_name
          );

          let sent_by = await sails.helpers.getSentBy(
            vendor.store.id,
            business_name,
            vendor.store.image
          );
          let extra_data = JSON.stringify({
            id: updated.id || null,
            expiry_time: moment(updated.createdAt).add(
              process.env.ORDER_REQUEST_EXIPRY_DRIVER,
              "minutes"
            ),
            sent_by: sent_by,
          });
          await sails.helpers.sendPushNotification(
            driver.id,
            global.ROLE.DRIVER,
            title,
            body,
            false,
            extra_data,
            sails.config.notification.type.ORDER_REQUEST_RECEIVED
          );
          await sails.helpers.general.addNotification(
            driver.id,
            global.ROLE.DRIVER,
            title,
            body,
            extra_data,
            sails.config.notification.type.ORDER_REQUEST_RECEIVED
          );
          return exits.success(driver);
        }
      }
      let extra_data = JSON.stringify({
        id: inputs.order_id || null,
      });
      if (order.delivery_mode_id == 3) {
      }
      let noti_type =
        order.delivery_mode_id == 3 &&
        order.order_type == global.ORDER_TYPE.NORMAL
          ? sails.config.notification.type.NO_EXPRESS_DRIVER_FOUND
          : sails.config.notification.type.NO_DRIVER_FOUND;
      silent = noti_type == sails.config.notification.type.NO_DRIVER_FOUND;
      await sails.helpers.sendPushNotification(
        vendor.id,
        global.ROLE.VENDOR,
        "No rider found",
        "No rider found",
        silent,
        extra_data,
        noti_type
      );
      if (!silent) {
        template = await sails.helpers.getNotificationTemplate(noti_type);

        let title = template.meta[vendor.language];
        let body = template[vendor.language];
        await sails.helpers.general.addNotification(
          vendor.id,
          global.ROLE.VENDOR,
          title,
          body,
          extra_data,
          noti_type
        );
      }

      sails.log("helper assign-driver-to-order ended");
      return exits.success(false);
    } catch (err) {
      sails.log.error(`Error in helper assign-driver-to-order. ${err}`);
      return exits.success(false);
    }
  },
};
