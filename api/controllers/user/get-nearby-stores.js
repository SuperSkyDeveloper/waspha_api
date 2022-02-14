//const GeoPoint = require('geopoint');
const request = require("request");
module.exports = {
  friendlyName: "Get nearby vendors",

  description: "",

  inputs: {
    language: {
      type: "string",
      required: false,
      defaultsTo: "en",
    },
    location: {
      type: "json",
      required: true,
      custom: function (value) {
        return (
          _.isObject(value) &&
          //  && typeof value.address !== 'undefined'
          typeof value.lat !== "undefined" &&
          typeof value.lng !== "undefined" &&
          // && _.isString(value.address)
          _.isNumber(value.lat) &&
          _.isNumber(value.lng)
        );
      },
    },
    delivery: {
      type: "boolean",
      required: false,
    },
    pickup: {
      type: "boolean",
      required: false,
    },
  },

  exits: {
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
    serverError: {
      description: "send server error",
      responseType: "serverError",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action user/get-nearby-vendors");

    const criteria = process.env.NEARBY_RANGE; //in kilometers,will be fetched from server later
    let lat1 = inputs.location.lat;
    let lng1 = inputs.location.lng;

    try {
      var where = { deletedAt: null, is_online: true };
      let or = [];
      if (!_.isUndefined(inputs.delivery)) {
        or.push({ delivery: inputs.delivery });
      }
      if (!_.isUndefined(inputs.pickup)) {
        or.push({ pickup: inputs.pickup });
      }
      if (or) {
        where.or = or;
      }
      //console.log(where);
      const stores = await Store.find({
        where: where,
        select: [
          "id",
          "business_name",
          "ar",
          "lat",
          "lng",
          "image",
          "category_id",
          "delivery",
          "pickup",
          "vendor_id",
          "timings",
        ],
      }).populate("slots");
      //sails.log({ stores: stores });
      var all_stores = [];
      var category_ids = [];
      var categories = [];
      if (stores.length) {
        let locality_user = await sails.helpers.getLocalityByLatLng(lat1, lng1);
        for (const store of stores) {
          let locality_store = await sails.helpers.getLocalityByLatLng(
            store.lat,
            store.lng
          );
          sails.log({
            store: { name: store.business_name, locality: locality_store },
          });
          if (
            locality_user &&
            locality_store &&
            locality_store.long_name != locality_user.long_name
          ) {
            continue;
          }
          store.business_name = {
            en: store.business_name,
            ar: store.ar,
          };
          let vendor = await Vendor.findOne({
            id: store.vendor_id,
            status: true,
          });
          if (!vendor) {
            continue;
          }
          let lat2 = store.lat;
          let lng2 = store.lng;
          // point1 = new GeoPoint(lat1, lng1);
          // point2 = new GeoPoint(lat2, lng2);
          // var distance = point1.distanceTo(point2, true)//output in kilometers
          var distance = parseFloat(
            (
              await sails.helpers.getDistance(
                { lat: lat1, lng: lng1 },
                { lat: lat2, lng: lng2 }
              )
            ).toFixed(2)
          );
          if (distance <= criteria) {
            var subcategories = await Store_subcategory.find({
              where: { store_id: store.id },
              select: ["subcategory_id"],
            });
            store.category_ids = [];
            if (subcategories) {
              subcategories.map(function (obj) {
                if (!store.category_id) {
                  store.category_id = obj.subcategory_id;
                }
                if (!category_ids.includes(obj.subcategory_id)) {
                  category_ids.push(obj.subcategory_id);
                }
                if (!store.category_ids.includes(obj.subcategory_id)) {
                  store.category_ids.push(obj.subcategory_id);
                }
              });
              // for (obj of subcategories) {
              //   if (!store.category_id) {
              //     store.category_id = obj.subcategory_id;
              //     category_ids.push(store.category_id);
              //     break;
              //   }
              // }
            }

            //store.distance = parseFloat(distance.toFixed(2));
            store.distance = distance;

            store.average_rating = await Store_review_rating.avg(
              "rating"
            ).where({ store_id: store.id });
            store.average_rating = parseFloat(store.average_rating.toFixed(2));
            let products = await sails.helpers.getStoreProducts(store.id);
            store.has_menu = products.length > 0 ? true : false;

            if (store.timings === "custom") {
              if (store.slots.length) {
                store.timings = await sails.helpers.formatStoreTimings(
                  store.slots,
                  inputs.language
                );
              }
            }
            delete store.slots;

            all_stores.push(store);
            if (
              store.category_id &&
              !category_ids.includes(store.category_id)
            ) {
              category_ids.push(store.category_id);
            }
          }
        } //end for
        //sails.log(category_ids);
        categories = await Category.find({
          where: { id: category_ids, deletedAt: null },
          select: [
            "id",
            "parent_id",
            "name",
            "slug",
            "image",
            "secondary_image",
            "en",
            "ar",
          ],
        });
        if (categories.length) {
          for (cat of categories) {
            cat.name = {
              en: cat.en,
              ar: cat.ar,
            };
            delete cat.en;
            delete cat.ar;
          }
        }
      }

      if (all_stores.length) {
        all_stores = all_stores.sort((a, b) =>
          a.distance > b.distance ? 1 : b.distance > a.distance ? -1 : 0
        );
        //all_stores = _.orderBy(all_stores, ['distance'],['asc']);
        sails.log(`${all_stores.length} nearby stores found`);
        return exits.success({
          status: true,
          message: sails.config.strings[inputs.language].STORES_FOUND.replace(
            "{total}",
            all_stores.length
          ),
          data: { stores: all_stores, categories: categories },
        });
      }
      return exits.ok({
        status: true,
        message: `Stores not found`,
        data: [],
      });
    } catch (err) {
      sails.log.error(`Error getting nearby stores. ${err}`);
      return exits.serverError({
        status: false,
        message: sails.config.strings[inputs.language].STORES_NOT_FOUND,
        data: [],
      });
    }
  },
};
