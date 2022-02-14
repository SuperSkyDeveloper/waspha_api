module.exports = {
  friendlyName: "App settings",

  description: "",

  inputs: {},

  exits: {},

  fn: async function (inputs, exits) {
    // await Category.updateOn({ id: 1 }).set({ ar: "Pharmacy" });
    const categories = await Category.find({
      where: { deletedAt: null },
      select: ["id", "parent_id", "name", "en", "ar", "slug", "image"],
    });
    for (c of categories) {
      c.name = {
        en: c.en,
        ar: c.ar,
      };
      delete c.en;
      delete c.ar;
    }
    const delivery_modes = await Delivery_mode.find({
      where: { deletedAt: null },
      select: [
        "id",
        "name",
        "title",
        "title_ar",
        "subtitle",
        "subtitle_ar",
        "image",
        "color_image",
      ],
    });
    const delivery_vehicles = await Delivery_vehicle.find({
      where: { deletedAt: null },
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

    for (m of delivery_modes) {
      m.title = {
        en: m.title,
        ar: m.title_ar,
      };
      m.subtitle = {
        en: m.subtitle,
        ar: m.subtitle_ar,
      };

      var image = {
        white: m.image,
        color: m.color_image,
      };
      delete m.image;
      delete m.color_image;
      delete m.title_ar;
      delete m.subtitle_ar;
      m.image = image;
    }
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

    let v_reasons = await Setting.find({
      key: ["v_receiving_rfp_reasons", "u_receiving_rfp_delivery_reasons"],
    }).populate("options");

    vendor_reasons = [];
    for (s of v_reasons) {
      switch (s.key) {
        case "v_receiving_rfp_reasons": {
          sails.log({ o: s.options });
          for (o of s.options) {
            vendor_reasons.push({ id: o.id, value: { en: o.en, ar: o.ar } });
          }
          sails.log(_.map(s.options, "value"));

          break;
        }
        case "v_receiving_rfp_delivery_reasons": {
          for (o of s.options) {
            vendor_reasons.push({ id: o.id, en: o.en, ar: o.ar });
          }
          break;
        }
      }
    }
    let v_cancellation_reasons = await Setting.find({
      key: [
        "v_sending_proposal_delivery_reasons",
        "v_receiving_accepted_proposal_reasons",
        "v_receiving_accepted_proposal_delivery_reasons",
        "v_assigning_driver_reasons",
      ],
    }).populate("options");
    let cancellation_reasons = [];
    for (s of v_cancellation_reasons) {
      for (o of s.options) {
        cancellation_reasons.push({ id: o.id, value: { en: o.en, ar: o.ar } });
      }
    }
    let translation = await Waspha_translation.find()
      .limit(1)
      .sort("createdAt DESC");
    let translations_updated_at = !_.isUndefined(translation[0].updatedAt)
      ? translation[0].updatedAt
      : null;
    return exits.success({
      status: true,
      message: `${categories.length} categories found successfully`,
      data: {
        translations_updated_at: translations_updated_at,
        categories: categories,
        delivery_modes: delivery_modes,
        delivery_vehicles: delivery_vehicles,
        vendor_rejection_reasons: vendor_reasons,
        vendor_cancellation_reasons: cancellation_reasons,
      },
    });
  },
};
