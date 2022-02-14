module.exports = {
  friendlyName: "Edit delivery vehicle",

  description: "",

  inputs: {
    id: {
      type: "number",
      required: true,
    },
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
      allowNull: true,
    },
    subtitle_ar: {
      type: "string",
      required: false,
      allowNull: true,
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
    sails.log("calling action admin/edit-delivery-vehicle");

    let vehicles = await Delivery_vehicle.find({ id: inputs.id }).limit(1);

    if (!vehicles[0]) {
      return exits.ok({
        status: false,
        data: [],
        message: "Invalid id",
      });
    }

    if (inputs.image) {
      is_valid_url = await sails.helpers.isValidUrl(inputs.image);
      if (!is_valid_url) {
        let existingImagePath = vehicles[0].image;
        if (existingImagePath != null) {
          let position = await sails.helpers.getCharacterPosition(
            existingImagePath,
            "/",
            3
          );
          await sails.helpers.aws.deleteFile(
            existingImagePath.substring(position + 1)
          );
        }

        inputs.image = await sails.helpers.aws.uploadFile(
          inputs.image,
          "vehicles"
        );
      }
    }
    if (inputs.color_image) {
      sails.log({ color_image: inputs.color_image });
      is_valid_url = await sails.helpers.isValidUrl(inputs.color_image);
      if (!is_valid_url) {
        let existingImagePath = vehicles[0].color_image;
        if (existingImagePath != null) {
          let position = await sails.helpers.getCharacterPosition(
            existingImagePath,
            "/",
            3
          );
          await sails.helpers.aws.deleteFile(
            existingImagePath.substring(position + 1)
          );
        }

        inputs.color_image = await sails.helpers.aws.uploadFile(
          inputs.color_image,
          "vehicles"
        );
      }
    }

    try {
      var updatedVehicle = await sails.models.delivery_vehicle
        .updateOne({ id: inputs.id })
        .set(inputs);

      if (updatedVehicle.id) {
        sails.log(`vehicle updated with id '${updatedVehicle.id}'`);

        return exits.success({
          status: true,
          data: updatedVehicle,
          message: "delivery vehicle updated successfully",
        });
      }
    } catch (err) {
      sails.log.error(`Error in updating delivery vehicle: ${err}`);
      return exits.serverError({
        status: false,
        message: `Error in updating delivery vehicle: ${err}`,
      });
      // …
    }
  },
};
