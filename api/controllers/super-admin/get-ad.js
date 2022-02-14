module.exports = {
  friendlyName: "Get ad",

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
    sails.log("calling action admin/get-ad");
    const ad = await Ad.findOne({
      where: { id: inputs.id, deletedAt: null },
    })
      .populate("category_id")
      .populate("subcategory_id");
    if (ad) {
      ad.type = ad.type;
      ad.type_description = global.AD_TYPE.DESCRIPTION[ad.type];
      if (ad.category_id) {
        ad.category = {
          id: ad.category_id.id,
          name: ad.category_id.en || ad.category_id.ar,
        };
        delete ad.category_id;
      }
      if (ad.subcategory_id) {
        ad.subcategory = {
          id: ad.subcategory_id.id,
          name: ad.subcategory_id.en || ad.subcategory_id.ar,
        };
        delete ad.subcategory_id;
      }

      if (ad.media) {
        ad.media = JSON.parse(ad.media);
      }
      if (ad.description) {
        ad.description = JSON.parse(ad.description);
      }
      ad.sm_all = false;
      if (ad.service_modes) {
        ad.service_modes = ad.service_modes.split(",");
        if (ad.service_modes.length == 2) {
          ad.sm_all = true;
        }
      }

      let restricted_vendors = await Ad_restricted_vendor.find({
        ad_id: ad.id,
      });
      ad.all_roles = true;
      if (restricted_vendors.length) {
        ad.vendor_id = _.map(restricted_vendors, "vendor_id");
        ad.all_roles = false;
      }
      let restricted_users = await Ad_restricted_user.find({
        ad_id: ad.id,
      });
      if (restricted_users.length) {
        ad.user_id = _.map(restricted_users, "user_id");
        ad.all_roles = false;
      }
      let restricted_drivers = await Ad_restricted_driver.find({
        ad_id: ad.id,
      });
      if (restricted_drivers.length) {
        ad.user_id = _.map(restricted_drivers, "driver_id");
        ad.all_roles = false;
      }
      return exits.success({
        status: true,
        message: "ad found successfully",
        data: ad,
      });
    }
    return exits.notFound({
      status: false,
      message: "Not found",
      data: [],
    });
  },
};
