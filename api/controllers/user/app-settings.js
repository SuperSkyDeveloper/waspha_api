module.exports = {
  friendlyName: "App settings",

  description: "App settings user",

  inputs: {},

  exits: {},

  fn: async function (inputs, exits) {
    sails.log("calling action user/app-settings");
    const user_reasons = await Setting.find({
      where: {
        key: { contains: "user_reason" },
      },
      select: ["id", "value"],
    });
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

    let settings = await Setting.find({
      key: [
        "u_rfp_cancellation_reasons",
        "u_rfp_cancellation_delivery_reasons",
        "u_rfp_cancellation_pickup_reasons",
      ],
    }).populate("options", {
      select: ["id", "value", "en", "ar"],
    });

    data = {
      rfp_cancellation_reasons: { delivery: [], pickup: [] },
      proposal_rejection_reasons: { delivery: [], pickup: [] },
    };
    let translation = await Waspha_translation.find()
      .limit(1)
      .sort("createdAt DESC");
    let translations_updated_at = !_.isUndefined(translation[0].updatedAt)
      ? translation[0].updatedAt
      : null;
    data.translations_updated_at = translations_updated_at;
    for (s of settings) {
      let options = s.options.map(function (o) {
        return Object.assign(
          {
            id: o.id,
            value: { en: o.en, ar: o.ar },
          },
          _.omit(o, "id", "value", "en", "ar", "setting_id")
        );
      });
      switch (s.key) {
        case "u_rfp_cancellation_reasons": {
          Array.prototype.push.apply(
            data.rfp_cancellation_reasons.delivery,
            options
          );
          Array.prototype.push.apply(
            data.rfp_cancellation_reasons.pickup,
            options
          );
          sails.log(_.map(s.options, "value"));

          break;
        }
        case "u_rfp_cancellation_delivery_reasons": {
          Array.prototype.push.apply(
            data.rfp_cancellation_reasons.delivery,
            options
          );
          break;
        }
        case "u_rfp_cancellation_delivery_reasons": {
          Array.prototype.push.apply(
            data.rfp_cancellation_reasons.pickup,
            options
          );
          break;
        }
      }
    }

    settings = await Setting.find({
      key: [
        "u_receiving_proposal_reasons",
        "u_receiving_proposal_delivery_reasons",
        "u_receiving_proposal_pickup_reasons",
      ],
    }).populate("options", {
      select: ["id", "value", "en", "ar"],
    });

    for (s of settings) {
      options = s.options.map(function (o) {
        return Object.assign(
          {
            id: o.id,
            value: { en: o.en, ar: o.ar },
          },
          _.omit(o, "id", "value", "en", "ar", "setting_id")
        );
      });
      switch (s.key) {
        case "u_receiving_proposal_reasons": {
          Array.prototype.push.apply(
            data.proposal_rejection_reasons.delivery,
            options
          );

          Array.prototype.push.apply(
            data.proposal_rejection_reasons.pickup,
            options
          );
          sails.log(_.map(s.options, "value"));

          break;
        }
        case "u_receiving_proposal_delivery_reasons": {
          Array.prototype.push.apply(
            data.proposal_rejection_reasons.delivery,
            options
          );
          break;
        }
        case "u_receiving_proposal_pickup_reasons": {
          Array.prototype.push.apply(
            data.proposal_rejection_reasons.pickup,
            options
          );
          break;
        }
      }
    }
    // data = {
    //   rfp_cancellation_reasons: {
    //     delivery: [
    //       "Wrong information",
    //       "Wrong information",
    //       "Wrong information",
    //     ],
    //     pickup: ["Wrong information", "Wrong information", "Wrong information"],
    //   },
    //   proposal_rejection_reasons: {
    //     delivery: [
    //       "The price is very expensive",
    //       "The price is very expensive",
    //       "The price is very expensive",
    //     ],
    //     pickup: [
    //       "The price is very expensive",
    //       "The price is very expensive",
    //       "The price is very expensive",
    //     ],
    //   },
    // };
    return exits.success({
      status: true,
      message: `Found successfully`,
      data: data,
    });
  },
};
