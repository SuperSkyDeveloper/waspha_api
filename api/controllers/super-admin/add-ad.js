const moment = require("moment");
module.exports = {
  friendlyName: "Add ad",

  description: "",

  inputs: {
    vendor_id: {
      type: "json",
      required: false,
    },
    user_id: {
      type: "json",
      required: false,
    },
    driver_id: {
      type: "json",
      required: false,
    },
    category_id: {
      type: "number",
      required: false,
    },
    subcategory_id: {
      type: "number",
      required: false,
    },

    country_id: {
      type: "number",
      required: true,
    },
    is_requested: {
      type: "boolean",
      required: false,
    },
    type: {
      type: "string",
      required: false,
    },
    location: {
      type: "ref",
      required: false,
    },
    radius: {
      type: "number",
      required: true,
    },
    description: {
      type: "ref",
      required: false,
    },
    media: {
      type: "ref",
      required: false,
    },
    start_time: {
      type: "ref",
      columnType: "datetime",
      required: false,
    },
    end_time: {
      type: "ref",
      columnType: "datetime",
      required: false,
    },

    service_modes: {
      type: "json",
      required: false,
    },
    sm_all: {
      type: "boolean",
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
    sails.log("calling action super-admin/add-ad");

    let rec = {};
    rec.type = inputs.type;
    rec.category_id = inputs.category_id || null;
    rec.subcategory_id = inputs.subcategory_id || null;
    rec.is_requested = inputs.is_requested;
    rec.country_id = inputs.country_id;
    if (inputs.description) {
      rec.description = JSON.stringify(inputs.description);
    }
    if (inputs.location) {
      rec.location = JSON.stringify(inputs.location);
    }

    rec.start_time = moment(inputs.start_time).format("YYYY-MM-DD HH:mm:ss");
    rec.end_time = moment(inputs.end_time).format("YYYY-MM-DD HH:mm:ss");
    rec.radius = inputs.radius;

    if (inputs.sm_all == true) {
      rec.service_modes = `${global.RFP_TYPE.DELIVERY},${global.RFP_TYPE.PICKUP}`;
    } else {
      if (inputs.service_modes) {
        rec.service_modes = inputs.service_modes.join(",");
      }
    }

    if (inputs.media) {
      if (inputs.media.en) {
        is_valid_url = await sails.helpers.isValidUrl(inputs.media.en);
        if (is_valid_url === false) {
          inputs.media.en = await sails.helpers.aws.uploadFile(
            inputs.media.en,
            "ads"
          );
        } else {
          inputs.media.en = inputs.media.en;
        }
      }
      if (inputs.media.ar) {
        is_valid_url = await sails.helpers.isValidUrl(inputs.media.ar);
        if (is_valid_url === false) {
          inputs.media.ar = await sails.helpers.aws.uploadFile(
            inputs.media.ar,
            "ads"
          );
        } else {
          inputs.media.ar = inputs.media.ar;
        }
      }
      rec.media = JSON.stringify(inputs.media);
    }

    try {
      let ad = await Ad.create(rec).fetch();
      if (ad) {
        if (inputs.vendor_id) {
          let restricted_vendors = [];
          for (id of inputs.vendor_id) {
            let obj = {};
            obj.ad_id = ad.id;
            obj.vendor_id = id;
            restricted_vendors.push(obj);
          }
          await Ad_restricted_vendor.createEach(restricted_vendors).exec(
            function createCB(err, created) {
              if (err) {
                sails.log.error(
                  `error in attaching restricted vendors to promo code,Error: ${err}`
                );
              }
              sails.log("restricted vendor(s) attached to promo code", created);
            }
          );
        }
        if (inputs.user_id) {
          let restricted_users = [];
          for (id of inputs.user_id) {
            let obj = {};
            obj.ad_id = ad.id;
            obj.user_id = id;
            restricted_users.push(obj);
          }
          await Ad_restricted_user.createEach(restricted_users).exec(
            function createCB(err, created) {
              if (err) {
                sails.log.error(
                  `error in attaching restricted users to promo code,Error: ${err}`
                );
              }
              sails.log("restricted user(s) attached to promo code", created);
            }
          );
        }
        if (inputs.driver_id) {
          let restricted_drivers = [];
          for (id of inputs.driver_id) {
            let obj = {};
            obj.ad_id = ad.id;
            obj.driver_id = id;
            restricted_drivers.push(obj);
          }
          await Ad_restricted_driver.createEach(restricted_drivers).exec(
            function createCB(err, created) {
              if (err) {
                sails.log.error(
                  `error in attaching restricted drivers to promo code,Error: ${err}`
                );
              }
              sails.log("restricted driver(s) attached to promo code", created);
            }
          );
        }
      }

      return exits.success({
        status: true,
        message: "Created successfully",
        data: ad,
      });
    } catch (err) {
      sails.log(`Error in action super-admin/add-ad. ${err}`);
      return exits.ok({
        status: false,
        message: "Unable to create",
      });
    }
  },
};
