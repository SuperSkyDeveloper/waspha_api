var axios = require("axios");

module.exports = {
  friendlyName: "Get eta drivers",

  description: "",

  inputs: {},

  exits: {
    success: {
      outputFriendlyName: "Eta drivers",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("helper get-eta-drivers started");

    try {
      let url = sails.config.tracking.url + "/eta-driver-list";
      let statuses = await sails.helpers.getAllStatuses([
        global.STATUS.ACCEPTED,
        global.STATUS.AT_PICKUP,
        global.STATUS.PICKED_UP,
        global.STATUS.DELIVERY_STARTED,
        global.STATUS.AT_DELIVERY,
        global.STATUS.DELIVERY_CONFIRMED,
      ]);
      st_ids = Object.values(statuses);
      // let rides = await Proposal_driver.find({
      //   status_id: st_ids,
      // });
      // if (rides.length) {
      //   driver_ids = _.map(rides, "driver_id");

      // }
      var body = await axios.post(url);

      if (!body.data.status) {
        sails.log.error("Unable to emit data to realtime server", body.data);
      }
      listOfDrivers = body.data.data.listOfDrivers;
      if (listOfDrivers.length) {
        listOfDrivers = _.filter(listOfDrivers, function (obj) {
          return obj.taskId !== null;
        });
        task_ids = _.map(listOfDrivers, "taskId");
        if (!task_ids.length) {
          sails.log("No task id found to send eta");
          sails.log("helper get-eta-drivers ended");
          return exits.success();
        }
        let rides = await Proposal_driver.find({
          id: task_ids,
          status_id: st_ids,
        }).populate("proposal_id");
        if (!rides.length) {
          sails.log("No rides found to send eta");
          sails.log("helper get-eta-drivers ended");
          return exits.success();
        }

        proposals = _.map(rides, "proposal_id");
        rfp_store_ids = _.map(proposals, "rfp_store_id");

        traditional_orders = _.filter(proposals, function (obj) {
          return obj.store_id !== null;
        });
        var store_ids = [];
        if (traditional_orders.length) {
          store_ids = _.map(traditional_orders, "store_id");
        }

        if (rfp_store_ids.length) {
          var rfp_stores = await Request_for_proposal_store.find({
            id: rfp_store_ids,
          }).populate("rfp_id");

          store_ids2 = _.map(rfp_stores, "store_id");
          if (store_ids2.length) {
            store_ids = _.merge(store_ids, store_ids2);
          }

          var user_ids = [];
          for (rs of rfp_stores) {
            user_ids.push(rs.rfp_id.user_id);
          }
        }
        if (store_ids.length) {
          var stores = await Store.find({
            where: { id: store_ids },
          });
          var vendor_ids = _.map(stores, "vendor_id");
        }

        if (vendor_ids.length) {
          var vendors = await Vendor.find({
            id: vendor_ids,
          });
        }
        if (user_ids.length) {
          var users = await User.find({
            id: user_ids,
          });
        }

        //t = _.find(p, { delivery_location: null });
        t = _.filter(proposals, function (obj) {
          return obj.delivery_location == null;
        });

        let data_to_emit = [];
        for (proposal of proposals) {
          let pickup_location = null;
          let delivery_location = null;
          let store_id = null;
          if (proposal.delivery_location) {
            pickup_location = JSON.parse(proposal.pickup_location);
            delivery_location = JSON.parse(proposal.delivery_location);
            store_id = proposal.store_id;
            store = _.find(stores, { id: store_id });
            vendor = _.find(vendors, { id: store.vendor_id });
            if (!vendor.is_device_active) {
              sails.log(
                `Vendor is inactive on device so no need to emit eta, order:${proposal.id}, order_type:${proposal.order_type}`
              );
              continue;
            }
          } else {
            rfp_store = _.find(rfp_stores, { id: proposal.rfp_store_id });
            if (rfp_store) {
              store_id = rfp_store.store_id;
              store = _.find(stores, { id: store_id });
              vendor = _.find(vendors, { id: store.vendor_id });
              user = _.find(users, { id: rfp_store.rfp_id.user_id });
              if (
                vendor.is_device_active == false &&
                user.is_device_active == false
              ) {
                sails.log(
                  `user & vendor are inactive on devices so no need to emit eta, order:${proposal.id}, order_type:${proposal.order_type}`
                );
                continue;
              }
              pickup_location = {
                address: store.address,
                lat: store.lat,
                lng: store.lng,
              };
              delivery_location = {
                address: rfp_store.rfp_id.delivery_location,
                lat: rfp_store.rfp_id.lat,
                lng: rfp_store.rfp_id.lng,
              };
            }
          }
          ride = _.find(rides, { proposal_id: { id: proposal.id } });
          driver = _.find(listOfDrivers, { driverId: ride.driver_id });
          if (driver) {
            let temp = { businessId: store_id, vendorEta: null, userEta: null };
            if (ride.status_id == 2) {
              driver_to_pickup_eta = await sails.helpers.getDistanceMatrix(
                {
                  lat: driver.location.coords.latitude,
                  lng: driver.location.coords.longitude,
                },
                { lat: pickup_location.lat, lng: pickup_location.lng }
              );
              pickup_to_delivery_eta = await sails.helpers.getDistanceMatrix(
                {
                  lat: pickup_location.lat,
                  lng: pickup_location.lng,
                },
                { lat: delivery_location.lat, lng: delivery_location.lng }
              );
              temp.vendorEta = { ...driver_to_pickup_eta };
              temp.userEta = { ...driver_to_pickup_eta };
              value1 = driver_to_pickup_eta.distance.value;
              value2 = pickup_to_delivery_eta.distance.value;
              value3 = value1 + value2;
              temp.userEta.distance.value = value3;
              //value = 0;
              temp.userEta.distance.text =
                (await sails.helpers.fixDoubleValue(
                  temp.userEta.distance.value / 1000
                )) + " km";
              temp.userEta.duration.value +=
                pickup_to_delivery_eta.duration.value;
              temp.userEta.duration.text =
                (await sails.helpers.fixDoubleValue(
                  temp.userEta.duration.value / 60
                )) + " mins";
            } else {
              driver_to_delivery_eta = await sails.helpers.getDistanceMatrix(
                {
                  lat: driver.location.coords.latitude,
                  lng: driver.location.coords.longitude,
                },
                { lat: delivery_location.lat, lng: delivery_location.lng }
              );
              temp.userEta = driver_to_delivery_eta;
            }
            data_to_emit.push(temp);
          }
        }
        if (data_to_emit.length) {
          //emit data
          await sails.helpers.emitEvent("taskEta", data_to_emit);
        }
      }
    } catch (err) {
      sails.log.error(`Error in helper get-eta-drivers. ${err}`);
    }
    sails.log("helper get-eta-drivers ended");
    return exits.success();
  },
};
