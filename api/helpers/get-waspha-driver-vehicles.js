const geolib = require("geolib");

module.exports = {
  friendlyName: "Get waspha driver vehicles",

  description: "",

  inputs: {
    order_id: {
      type: "number",
      required: true,
    },
  },

  exits: {
    success: {
      outputFriendlyName: "Waspha driver vehicles",
    },
  },

  fn: async function (inputs, exits) {
    try {
      let order = await Proposal.findOne({ id: inputs.order_id });
      if (!order) {
        return exits.success([]);
      }
      let pickup_location = JSON.parse(order.pickup_location);
      let delivery_location = JSON.parse(order.delivery_location);

      let where = {
        type: global.DRIVER_TYPE.WASPHA_EXPRESS,
        is_online: true,
        status: true,
        is_zone_selected: true,
      };
      let drivers = await Driver.find({
        where: where,
      });
      if (!drivers.length) {
        return exits.success([]);
      }

      let pd = await Proposal_driver.find({
        where: {
          status_id: [1, 2, 9, 10, 11, 12, 13, 15],
          driver_id: _.map(drivers, "id"),
        },
        select: ["driver_id"],
      });
      let vehicle_ids = [];
      for (driver of drivers) {
        if (pd.length) {
          assigned_already = _.find(pd, { driver_id: driver.id });
          if (assigned_already) {
            continue;
          }
        }
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
          vehicle_ids.push(driver.vehicle_id);
        }
      }
      if (vehicle_ids.length) {
        delivery_vehicles = await sails.helpers.getDeliveryVehicles(
          vehicle_ids
        );
        return exits.success(delivery_vehicles);
      }
      return exits.success([]);

      sails.log("action vendor/get-waspha-driver-vehicles ended");
    } catch (err) {
      sails.log.error(
        `Error in helper vendor/get-waspha-driver-vehicles. ${err}`
      );
      return exits.success([]);
    }
  },
};
