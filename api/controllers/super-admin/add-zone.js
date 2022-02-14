module.exports = {
  friendlyName: "Add zone",

  description: "",

  inputs: {
    admin: {
      type: "ref",
      required: true,
      description: "Logged in admin",
    },
    name: {
      type: "string",
      required: true,
    },
    coords: {
      type: "ref",
      required: true,
    },
    slots: {
      type: "ref",
      required: true,
    },
  },

  exits: {
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("action super-admin/add-zone started");
    try {
      let zone = await Fixed_zone.create({ name: inputs.name }).fetch();
      if (!zone) {
        return exits.ok({
          status: false,
          message: "Unable to create",
        });
      }
      inputs.coords = await sails.helpers.changeKeys(inputs.coords, {
        lat: "latitude",
        lng: "longitude",
      });
      for (coord of inputs.coords) {
        coord.fixed_zone_id = zone.id;
        await Fixed_zone_coordinate.create(coord);
      }

      sails.log(JSON.stringify(inputs.coords));
      // await Fixed_zone_coordinate.createEach(inputs.coords).exec(
      //   async function createCB(err, created) {
      //     await Fixed_zone_coordinate.create(inputs.coords[0]);
      //     if (err) {
      //       sails.log.error(
      //         `error in attaching coordinates to fixed zone,Error: ${err}`
      //       );
      //     }
      //     sails.log("coordinates attached to fixed zone", created);
      //   }
      // );

      for (slot of inputs.slots) {
        slot.fixed_zone_id = zone.id;
        await Fixed_zone_allowed_slot.create(slot);
      }
      // await Fixed_zone_allowed_slot.createEach(inputs.slots).exec(
      //   function createCB(err, created) {
      //     if (err) {
      //       sails.log.error(
      //         `error in attaching allowed slots to fixed zone,Error: ${err}`
      //       );
      //     }
      //     sails.log("slots(s) attached fixed zone", created);
      //   }
      // );

      ////
      zone = await sails.helpers.getFixedZones(zone.id);
      if (zone.length) {
        // zone[0].latlng = await sails.helpers.changeKeys(zone[0].latlng, {
        //   latitude: "lat",
        //   longitude: "lng",
        // });

        let vehicle_ids = _.map(zone[0].slots, "vehicle_id");
        let vehicles = await Delivery_vehicle.find({ select: ["id", "name"] });
        for (v of vehicles) {
          sails.log({ v });
          obj = _.find(zone[0].slots, "vehicle_id", v.id);
          zone[0][v.name] = obj.allowed_slots;
        }
        return exits.success({
          status: true,
          message: "Created",
          data: zone[0],
        });
      }
      /////

      return exits.ok({
        status: false,
        message: "Unable to create",
      });
    } catch (err) {
      sails.log.error(`Error in action super-admin/addd-zone. ${err}`);
      return exits.ok({
        status: false,
        message: "Unable to create",
      });
    }
  },
};
