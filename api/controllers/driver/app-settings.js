module.exports = {
  friendlyName: "App settings",

  description: "App settings driver",

  inputs: {},

  exits: {},

  fn: async function (inputs, exits) {
    sails.log("calling action driver/app-settings");
    let driver_reasons = await Setting.find({
      where: {
        key: { contains: "driver_reason" },
      },
      select: ["id", "value"],
    }).populate("options");
    driver_reasons = driver_reasons[0].options;
    reasons = [];
    for (reason of driver_reasons) {
      temp = {};
      temp.id = reason.id;
      temp.value = {
        en: reason.en,
        ar: reason.ar,
      };
      delete reason.en;
      delete reason.ar;
      reasons.push(temp);
    }
    // driver_reasons.forEach((reason) => {
    //   reason.value = {
    //     en: reason.en,
    //     ar: reason.ar,
    //   };
    //   delete reason.en;
    //   delete reason.ar;
    // });
    const delivery_vehicles = await Delivery_vehicle.find({
      select: [
        "id",
        "name",
        "display_name",
        "title",
        "subtitle",
        "image",
        "color_image",
      ],
    });
    for (v of delivery_vehicles) {
      var image = {
        white: v.image,
        color: v.color_image,
      };
      delete v.image;
      delete v.color_image;
      v.image = image;
    }

    let translation = await Waspha_translation.find()
      .limit(1)
      .sort("createdAt DESC");
    let translations_updated_at = !_.isUndefined(translation[0].updatedAt)
      ? translation[0].updatedAt
      : null;

    penalty = await sails.helpers.getSetting("waspha_penalty_fee_driver");
    return exits.success({
      status: true,
      message: `Found successfully`,
      data: {
        translations_updated_at: translations_updated_at,
        expiry_minutes: process.env.ORDER_REQUEST_EXIPRY_DRIVER,
        cancellation_reasons: reasons,
        delivery_vehicles: delivery_vehicles,
        penalty_fee: penalty[0].value,
      },
    });
  },
};
