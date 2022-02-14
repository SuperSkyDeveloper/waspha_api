const moment = require("moment");
module.exports = {
  friendlyName: "Add delivery vehicle ",

  description: "",

  inputs: {
    title: {
      type: "string",
      required: true,
    },
    title_ar: {
      type: "string",
      required: true,
    },
    subtitle: {
      type: "string",
      required: false,
    },
    subtitle_ar: {
      type: "string",
      required: false,
    },
    image: {
      type: "string",
      required: true,
    },
    color_image: {
      type: "string",
      required: true,
    },
  },

  exits: {
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
    invalidRequest: {
      description: "Send invalidRequest response",
      responseType: "invalidRequest",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action super-admin/add-delivery-vehicle");
    console.log({ inputs });

    let title = inputs.title;

    try {
      let exist = await Delivery_vehicle.find({
        name: title,
      }).limit(1);
      if (exist.length) {
        return exits.invalidRequest({
          status: false,
          message: "Delivery vehicle s already exist with this title",
          data: null,
        });
      }
      inputs.name = inputs.title.toLowerCase();
      inputs.display_name = inputs.title;
      if (inputs.image) {
        is_valid_url = await sails.helpers.isValidUrl(inputs.image);
        if (is_valid_url === false) {
          inputs["image"] = await sails.helpers.aws.uploadFile(
            inputs.image,
            "delivery_vehicles"
          );
        }
      }
      if (inputs.color_image) {
        is_valid_url = await sails.helpers.isValidUrl(inputs.color_image);
        if (is_valid_url === false) {
          inputs["color_image"] = await sails.helpers.aws.uploadFile(
            inputs.color_image,
            "delivery_vehicles"
          );
        }
      }
      created = await Delivery_vehicle.create(inputs).fetch();
      if (created) {
        let dvc = await Delivery_vehicle_charge.find({ select: ["country"] });
        if (dvc.length) {
          country_ids = _.uniq(_.map(dvc, "country"));
          for (country of country_ids) {
            await Delivery_vehicle_charge.create({
              country: country,
              delivery_vehicle: created.id,
              base_fee: 5,
              fee_per_minute: 1,
              fee_per_km: 0.5,
            });
          }
        }
      }
      return exits.success({
        status: true,
        message: "Created successfully",
        data: created,
      });
    } catch (err) {
      sails.log(`Error in action super-admin/add-delivery-vehicle-. ${err}`);
      return exits.ok({
        status: false,
        message: "Unable to create",
      });
    }
  },
};
