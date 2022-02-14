const moment = require("moment");
const strings = sails.config.strings;

module.exports = {
  friendlyName: "Edit store",

  description: "",

  inputs: {
    vendor: {
      type: "ref",
      required: true,
      description: "logged in vendor",
    },
    business_name: {
      type: "ref",
      required: true,
    },
    location: {
      type: "json",
      required: false,
      custom: function (value) {
        return (
          _.isObject(value) &&
          typeof value.address !== "undefined" &&
          typeof value.lat !== "undefined" &&
          typeof value.lng !== "undefined" &&
          _.isString(value.address) &&
          _.isNumber(value.lat) &&
          _.isNumber(value.lng)
        );
      },
    },

    delivery_range: {
      type: "number",
      required: true,
    },
    categories: {
      type: "json",
      required: false,
      custom: function (value) {
        for (i of value) {
          if (!_.isNumber(i)) {
            return false;
          }
        }
        return true;
      },
    },
    subcategories: {
      type: "json",
      required: false,
      custom: function (value) {
        for (i of value) {
          if (!_.isNumber(i)) {
            return false;
          }
        }
        return true;
      },
    },

    timings: {
      type: "json",
      required: false,
    },
    image: {
      type: "string",
      required: false,
    },
    document: {
      type: "json",
      required: false,
    },
    proposal_prep_time: {
      type: "number",
      required: false,
    },
    proposal_selection_time: {
      type: "number",
      required: false,
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
    sails.log("calling action vendor/edit-store");

    if (_.isUndefined(inputs.vendor.store)) {
      return exits.ok({
        status: false,
        message: strings[inputs.vendor.language].BUSINESS_REGISTRATION_REQUIRED,
        data: exists,
      });
    }

    const business_name = inputs.business_name;

    const delivery_range = inputs.delivery_range;
    const location = inputs.location;
    const timings = inputs.timings;
    const category_id = inputs.category_id || null;
    const vendor_id = inputs.vendor.id;

    try {
      const rec = {
        business_name: business_name.en,
        ar: business_name.ar,
        address: location.address,
        lat: location.lat,
        lng: location.lng,
        delivery_range: delivery_range,
        timings: typeof timings.custom === "boolean" ? "fulltime" : "custom",
        vendor_id: vendor_id,
      };
      if (inputs.image) {
        rec["image"] = inputs.image;
      }

      if (inputs.proposal_prep_time) {
        rec["proposal_prep_time"] = inputs.proposal_prep_time;
      }
      if (inputs.proposal_selection_time) {
        rec["proposal_selection_time"] = inputs.proposal_selection_time;
      }
      var store = await Store.updateOne({ id: inputs.vendor.store.id }).set(
        rec
      );

      if (store.id) {
        sails.log(`store updated with id '${store.id}'`);
        await Store_document.destroy({ store_id: store.id });
        //rec['document'] = await sails.helpers.aws.uploadFile(inputs.document.file,'stores', inputs.document.type);
        if (inputs.document) {
          //rec['document'] = await sails.helpers.aws.uploadFile(inputs.document.file,'stores', inputs.document.type);
          let all_docs = [];
          inputs.document.forEach(function (url) {
            let doc = {};
            doc["store_id"] = store.id;
            doc["document"] = url;
            all_docs.push(doc);
          });
          await Store_document.createEach(all_docs).exec(function createCB(
            err,
            created
          ) {
            if (err) {
              sails.log.error(
                `error in attaching subcategory to store,Error: ${err}`
              );
            }
            sails.log("subcategory(s) attached to store", created);
          });
        }

        await Store_subcategory.destroy({ store_id: inputs.vendor.store.id });
        await Store_timing.destroy({ store_id: inputs.vendor.store.id });
        query = `UPDATE stores SET location_coordinates = ST_GEOMFROMTEXT('POINT(${store.lng} ${store.lat})') WHERE id = ${store.id};`;
        console.log(await sails.sendNativeQuery(query));
        var all_subcats = [];
        if (inputs.categories) {
          inputs.categories.forEach(function (item) {
            var subcat = {};
            subcat["store_id"] = store.id;
            subcat["subcategory_id"] = item;
            all_subcats.push(subcat);
          });
        }
        if (inputs.subcategories) {
          inputs.subcategories.forEach(function (item) {
            var subcat = {};
            subcat["store_id"] = store.id;
            subcat["subcategory_id"] = item;
            all_subcats.push(subcat);
          });
        }
        if (all_subcats.length) {
          sails.log({ all_subcats: all_subcats });
          await Store_subcategory.createEach(all_subcats).exec(
            function createCB(err, updated) {
              if (err) {
                sails.log.error(
                  `error in attaching subcategory to store,Error: ${err}`
                );
              }
              sails.log("subcategory(s) attached to store", updated);
            }
          );
        }
        if (_.isObject(timings.custom)) {
          sails.log("editing custom timings for store");
          const items = [];
          // timings.custom.forEach(function(i){

          //   i.shift.forEach(function(shift){
          //     console.log("from:",shift['from']);

          //   });

          // })
          for (i of timings.custom) {
            var item = {};
            item["day"] = i["day"];
            item["store_id"] = store.id;

            for (shift of i.shift) {
              item["from"] = moment(shift["from"]).format(
                "YYYY-MM-DD HH:mm:ss"
              );
              item["to"] = moment(shift["to"]).format("YYYY-MM-DD HH:mm:ss");
              //items.push(item);
              await Store_timing.create(item);
            }
          }
        }
        updated = await Vendor_message.update({
          vendor_id: inputs.vendor.id,
          deletedAt: null,
        }).set({ deletedAt: moment().format("YYYY-MM-DD HH:mm:ss") });

        store.location = {
          address: store.address,
          lat: store.lat,
          lng: store.lng,
        };
        delete store.address;
        delete store.lat;
        delete store.lng;
        delete store.location_coordinates;
        return exits.success({
          status: true,
          data: store,
          message: strings[inputs.vendor.language].BUSINESS_PROFILE_UPDATED,
        });
      }
    } catch (err) {
      sails.log.error(`Exception occured: ${err}`);
      return exits.serverError({
        status: false,
        message: strings[inputs.vendor.language].UNABLE_TO_UPDATE,
      });
    }
  },
};
