module.exports = {
  friendlyName: "Get zone",

  description: "",

  inputs: {
    id: {
      type: "number",
      required: true,
    },
  },

  exits: {
    notFound: {
      responseType: "notFound",
      description: "Send notFound response",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action admin/get-zone");

    // const zone = await Fixed_zone.find({
    //   where: { id: inputs.id },
    //   select: ["id", "name"],
    // })
    //   .populate("latlng")
    //   .limit(1);
    let zone = await sails.helpers.getFixedZones(inputs.id);
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
        if (obj) {
          zone[0][v.name] = obj.allowed_slots;
        }
      }
      return exits.success({
        status: true,
        message: "zone found successfully",
        data: zone[0],
      });
    }
    return exits.notFound({
      status: false,
      message: "Not found",
      data: [],
    });
  },
};
