var axios = require("axios");
const geolib = require("geolib");
module.exports = {
  friendlyName: "Check waspha driver zones",

  description: "",

  inputs: {},

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("helper check-waspha-driver-zones started");

    let url = sails.config.tracking.url + "/get-driver-list";
    try {
      let payload = {
        hasFixedZone: true,
      };
      var body = await axios.post(url, payload);
      if (!body.data.status) {
        sails.log.error("Unable to emit data to realtime server", body.data);
      }
      listOfDrivers = body.data.data.listOfDrivers;
      if (listOfDrivers.length) {
        let driver_ids = _.map(listOfDrivers, "driverId");
        let driver_fz = await Driver_fixed_zone.find({
          where: { driver_id: driver_ids },
          select: ["fixed_zone_id", "driver_id"],
        });
        let fixed_zone_ids = _.map(driver_fz, "fixed_zone_id");
        let fixed_zones = await Fixed_zone.find({
          where: { id: fixed_zone_ids },
        }).populate("latlng", { select: ["latitude", "longitude"] });
        let driver_ids_to_online = [];
        let driver_ids_to_offline = [];
        var filtered_drivers = [];
        for (driver of listOfDrivers) {
          let filtered_driver = { driverId: driver.driverId };
          dfz = _.find(driver_fz, { driver_id: driver.driverId });
          if (!dfz) {
            continue;
          }
          fz = _.find(fixed_zones, { id: dfz.fixed_zone_id });
          in_range = geolib.isPointInPolygon(
            {
              latitude: driver.location.coords.latitude,
              longitude: driver.location.coords.longitude,
            },
            fz.latlng
          );
          console.log({ in_range });
          if (in_range) {
            if (driver.isOnline == false) {
              driver_ids_to_online.push(driver.driverId);
              filtered_driver.isOnline = true;
              filtered_drivers.push(filtered_driver);
            }
          } else {
            if (driver.isOnline == true) {
              driver_ids_to_offline.push(driver.driverId);
              filtered_driver.isOnline = false;
              filtered_drivers.push(filtered_driver);
            }
          }
        }
        if (driver_ids_to_online.length) {
          sails.log({ driverIdsToOnline: driver_ids_to_online });
          await Driver.update({ id: driver_ids_to_online }).set({
            is_online: true,
          });
        }
        if (driver_ids_to_offline.length) {
          sails.log({ driverIdsToOnline: driver_ids_to_offline });
          await Driver.update({ id: driver_ids_to_offline }).set({
            is_online: false,
          });
        }
        if (filtered_drivers.length) {
          //emit data
          await sails.helpers.emitEvent("expressDriverInfo", filtered_drivers);
        }
      }
      sails.log("No express drivers with fixed zone found");
    } catch (err) {
      sails.log.error(`Error in helper check-waspha-driver-zone. ${err}`);
    }
    sails.log("helper check-waspha-driver-zones ended");
    return exits.success();
  },
};
