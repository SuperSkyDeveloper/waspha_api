module.exports = {
  friendlyName: "Get delivery vehicles",

  description: "",

  inputs: {
    vehicle_ids: {
      type: "json",
      required: false,
    },
  },

  exits: {
    success: {
      outputFriendlyName: "Delivery vehicles",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("helper get-delivery-vehicles started");
    try {
      let where = { deletedAt: null };
      if (!_.isUndefined(inputs.vehicle_ids)) {
        where.id = inputs.vehicle_ids;
      }
      const delivery_vehicles = await Delivery_vehicle.find({
        where: where,
        select: [
          "id",
          "name",
          "display_name",
          "title",
          "title_ar",
          "subtitle",
          "subtitle_ar",
          "image",
          "color_image",
        ],
      });
      for (v of delivery_vehicles) {
        v.title = {
          en: v.title,
          ar: v.title_ar,
        };
        v.subtitle = {
          en: v.subtitle,
          ar: v.subtitle_ar,
        };

        var image = {
          white: v.image,
          color: v.color_image,
        };
        delete v.image;
        delete v.color_image;
        delete v.title_ar;
        delete v.subtitle_ar;
        v.image = image;
      }
      return exits.success(delivery_vehicles);
    } catch (err) {
      sails.log.error(`Error in helper get-delivery-vehicles. ${err}`);
      return exits.success([]);
    }
  },
};
