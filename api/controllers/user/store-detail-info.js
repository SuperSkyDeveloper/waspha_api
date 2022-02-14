//const GeoPoint = require('geopoint');
module.exports = {
  friendlyName: "Store detailed info",

  description: "",

  inputs: {
    user: {
      type: "ref",
      required: false,
      description: "logged in user",
    },
    language: {
      type: "string",
      required: false,
      defaultsTo: "en",
    },
    store_id: {
      type: "number",
      required: true,
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
    sails.log("calling action user/store-detail");
    const strings = sails.config.strings[inputs.language];
    sails.log({ inputs: inputs });
    try {
      const store = await Store.findOne({
        where: { id: inputs.store_id },
        select: [
          "id",
          "business_name",
          "ar",
          "image",
          "lat",
          "lng",
          "timings",
          "category_id",
          "address",
          "country_code",
          "phone",
        ],
      }).populate("categories");
      // sails.log({ categories: store.categories });
      if (store) {
        store.business_name = {
          en: store.business_name,
          ar: store.ar,
        };
        let lat1 = inputs.location.lat;
        let lng1 = inputs.location.lng;

        let lat2 = store.lat;
        let lng2 = store.lng;

        // point1 = new GeoPoint(lat1, lng1);
        // point2 = new GeoPoint(lat2, lng2);
        // store.distance = parseFloat(point1.distanceTo(point2, false).toFixed(2))//output in kilometers

        store.category_id = !_.isUndefined(store.categories[0].subcategory_id)
          ? store.categories[0].subcategory_id
          : null;
        delete store.categories;
        store.distance = parseFloat(
          (
            await sails.helpers.getDistance(
              { lat: lat1, lng: lng1 },
              { lat: lat2, lng: lng2 }
            )
          ).toFixed(2)
        );
        store.more_information = {
          address: store.address,
          contact: store.country_code + store.phone,
        };
        delete store.address;
        delete store.country_code;
        delete store.phone;
        if (store.timings === "custom") {
          var timings = await Store_timing.find({
            where: { store_id: store.id },
            select: ["day", "from", "to"],
          });

          if (timings.length) {
            timings = await sails.helpers.formatStoreTimings(
              timings,
              inputs.language
            );
          }
          store.timings = timings;
        }
        store.average_rating = await Store_review_rating.avg("rating").where({
          store_id: store.id,
        });
        store.average_rating = parseFloat(store.average_rating.toFixed(2));
        let products = await sails.helpers.getStoreProducts(store.id);
        store.has_menu = products.length > 0 ? true : false;
        store.has_previous_orders = null;
        if (!_.isUndefined(inputs.user) && !_.isNull(inputs.user)) {
          store.has_previous_orders = await sails.helpers.hasPreviousOrders(
            store.id,
            inputs.user.id
          );
          store.has_previous_orders =
            store.has_previous_orders > 0 ? true : false;
        }

        return exits.success({
          status: true,
          message: strings.FOUND,
          data: store,
        });
      }
      return exits.ok({
        status: true,
        message: strings.NOT_FOUND,
        data: [],
      });
    } catch (err) {
      sails.log.error(
        `Error getting store detailed info,store id: ${inputs.store_id}, Error: ${err}`
      );
      return exits.serverError({
        status: false,
        message: strings.NOT_FOUND,
        data: [],
      });
    }
  },
};
