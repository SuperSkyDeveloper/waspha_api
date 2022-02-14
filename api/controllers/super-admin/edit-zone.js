module.exports = {
  friendlyName: "Edit zone",

  description: "",

  inputs: {
    admin: {
      type: "ref",
      required: true,
      description: "Logged in admin",
    },
    id: {
      type: "number",
      required: true,
    },
    name: {
      type: "string",
      required: true,
    },
    coords: {
      type: "ref",
      required: false,
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
      sails.log({ inputs });

      let zone = await Fixed_zone.findOne({ id: inputs.id });
      if (!zone) {
        return exits.ok({
          status: false,
          message: "Invalid Id",
        });
      }
      let rec = {};
      if (inputs.name) {
        rec.name = inputs.name;
      }
      if (!_.isEmpty(rec)) {
        zone = await Fixed_zone.updateOne({ id: zone.id }).set(rec);
      }
      // if (inputs.coords) {
      //   inputs.coords = await sails.helpers.changeKeys(inputs.coords, {
      //     lat: "latitude",
      //     lng: "longitude",
      //   });
      //   for (coord of inputs.coords) {
      //     coord.fixed_zone_id = zone.id;
      //   }

      //   sails.log(JSON.stringify(inputs.coords));
      //   await Fixed_zone_coordinate.createEach(inputs.coords).exec(
      //     async function createCB(err, created) {
      //       await Fixed_zone_coordinate.create(inputs.coords[0]);
      //       if (err) {
      //         sails.log.error(
      //           `error in attaching coordinates to fixed zone,Error: ${err}`
      //         );
      //       }
      //       sails.log("coordinates attached to fixed zone", created);
      //     }
      //   );
      // }

      await Fixed_zone_allowed_slot.destroy({ fixed_zone_id: zone.id });
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
          message: "Updated",
          data: zone[0],
        });
      }
      /////

      return exits.ok({
        status: false,
        message: "Unable to update",
      });
    } catch (err) {
      sails.log.error(`Error in action super-admin/addd-zone. ${err}`);
      return exits.ok({
        status: false,
        message: "Unable to update",
      });
    }
  },
};
