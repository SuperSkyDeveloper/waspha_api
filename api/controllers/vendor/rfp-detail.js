const Setting = require("../../models/Setting");

module.exports = {
  friendlyName: "Rfp detail",

  description: "",

  inputs: {
    vendor: {
      type: "ref",
      required: true,
      description: "logged in vendor",
    },
    id: {
      type: "number",
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
    sails.log("calling action vendor/rfp-detail");
    const strings = sails.config.strings[inputs.vendor.language];
    const statuses = await sails.helpers.getAllStatuses();
    let rfps = await Request_for_proposal.find({
      where: {
        id: inputs.id,
        status_id: {
          "!=": [
            statuses.expired,
            statuses.cancelled,
            statuses.rejected,
            statuses.deleted,
            statuses.closed,
          ],
        },
      },
      select: [
        "id",
        "delivery_location",
        "lat",
        "lng",
        "landmark",
        "type",
        "subcategory_id",
        "createdAt",
      ],
    }).limit(1);
    let menu_promotions = await sails.helpers.getMenuPromotions();
    if (!rfps[0]) {
      return exits.ok({
        status: false,
        data: [],
        message: strings.INVALID_ID,
      });
    }

    let items = await Request_for_proposal_item.find({
      where: { rfp_id: rfps[0].id },
      select: [
        "id",
        "name",
        "quantity",
        "description",
        "requirements",
        "additional_notes",
        "image",
        "product_id",
      ],
    }).populate("product_id");
    rfps[0]["create_at"] = rfps[0].createdAt;
    rfps["category"] = null;
    const category = await Category.findOne({
      where: { id: rfps[0].subcategory_id },
      select: ["name", "slug", "parent_id"],
    });
    if (category) {
      rfps[0]["category"] = category;
    }

    rfps[0].delivery_location = {
      address: rfps[0].delivery_location,
      lat: rfps[0].lat,
      lng: rfps[0].lng,
    };
    rfps[0].waspha_fee_ratio = 5;

    let wasphaFeeObj = await sails.helpers.getWasphaFee(
      rfps[0].id,
      rfps[0].type,
      "rfp"
    );
    rfps[0].waspha_fee_ratio = wasphaFeeObj.wasphaFee;
    rfps[0].waspha_fee_type = wasphaFeeObj.wasphaFeeType;
    delete rfps[0].subcategory_id;
    delete rfps[0].createdAt;
    delete rfps[0].lat;
    delete rfps[0].lng;
    rfps[0].available_vehicles = {
      online: [],
      offline: [],
      waspha_express: [],
    };
    let online_vehicles = await Driver.find({
      store_id: inputs.vendor.store.id,
      type: global.DRIVER_TYPE.ONLINE,
      is_online: 1,
      deletedAt: null,
    });
    let offline_vehicles = await Driver.find({
      store_id: inputs.vendor.store.id,
      type: global.DRIVER_TYPE.OFFLINE,
      deletedAt: null,
    });
    let waspha_express_vehicles = await Driver.find({
      type: global.DRIVER_TYPE.WASPHA_EXPRESS,
      is_online: 1,
      deletedAt: null,
    });
    if (online_vehicles.length) {
      rfps[0].available_vehicles.online = _.unique(
        _.map(online_vehicles, "vehicle_id")
      );
    }
    if (offline_vehicles.length) {
      rfps[0].available_vehicles.offline = _.unique(
        _.map(offline_vehicles, "vehicle_id")
      );
    }
    if (waspha_express_vehicles.length) {
      rfps[0].available_vehicles.waspha_express = _.unique(
        _.map(waspha_express_vehicles, "vehicle_id")
      );
    }
    rfps[0].is_featured = false;
    for (item of items) {
      // console.log({
      //   product_id: item.product_id,
      //   menu: JSON.stringify(menu_promotions),
      // });
      if (item.product_id) {
        // sails.log({
        //   aaa: _.findLast(menu_promotions, {
        //     product_id: item.product_id.id,
        //   }),
        // });
        sails.log({ product_id: item.product_id });
        item.menu_promotion = await sails.helpers.getMenuPromotion(
          item.product_id.id,
          menu_promotions
        );
        if (item.menu_promotion) {
          rfps[0].is_featured = true;
        }

        item.name = {
          en: item.product_id.title,
          ar: item.product_id.title_ar,
        };
        item.image = {
          en: item.product_id.image,
          ar: item.product_id.image_ar,
        };
        item.description = {
          en: item.product_id.description,
          ar: item.product_id.description_ar,
        };
        item.product_id = item.product_id.id;
      }
    }
    rfps[0].items = items;
    //sails.log({ online_vehicles: online_vehicles });

    return exits.success({
      status: true,
      message: strings.FOUND,
      data: rfps[0],
    });
  },
};
