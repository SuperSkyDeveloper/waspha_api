const moment = require("moment");

module.exports = {
  friendlyName: "Add store",

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
    phone: {
      type: "json",
      required: true,
      custom: function (value) {
        return (
          _.isObject(value) &&
          !_.isUndefined(value.country_code) &&
          !_.isUndefined(value.phone_number) &&
          !_.isUndefined(value.number)
        );
      },
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
    category_id: {
      type: "number",
      required: false,
    },
    categories: {
      type: "json",
      required: false,
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
    sails.log("calling action vendor/add-store");
    let exists = await Store.findOne({ vendor_id: inputs.vendor.id });

    if (exists) {
      return exits.ok({
        status: false,
        message:
          sails.config.strings[inputs.vendor.language]
            .BUSINESS_ALREADY_REGISTERED,
        data: exists,
      });
    }

    const business_name = inputs.business_name;
    const country_code = inputs.phone.country_code.replace(/\s/g, "");
    const phone = inputs.phone.number.replace(/\s/g, "");
    const delivery_range = inputs.delivery_range;
    const location = inputs.location;
    const timings = inputs.timings;
    const category_id = inputs.category_id || null;
    const vendor_id = inputs.vendor.id;

    exists = await Store.findOne({ phone: phone, country_code: country_code });

    if (exists) {
      return exits.ok({
        status: false,
        message:
          sails.config.strings[inputs.vendor.language]
            .BUSINESS_EXISTS_WITH_PHONE_NO,
        data: [],
      });
    }

    try {
      const rec = {
        business_name: business_name.en,
        ar: business_name.ar,
        country_code: country_code,
        phone: phone,
        address: location.address,
        lat: location.lat,
        lng: location.lng,
        delivery_range: delivery_range,
        timings: typeof timings.custom === "boolean" ? "fulltime" : "custom",
        category_id: category_id,
        vendor_id: vendor_id,
        image: inputs.image || null,
      };

      if (inputs.proposal_prep_time) {
        rec["proposal_prep_time"] = inputs.proposal_prep_time;
      }
      if (inputs.proposal_selection_time) {
        rec["proposal_selection_time"] = inputs.proposal_selection_time;
      }
      var store = await Store.create(rec).fetch();

      if (store.id) {
        if (inputs.document) {
          await sails.helpers.general.addOrUpdateDocuments(
            inputs.document,
            store.id,
            global.ROLE.VENDOR
          );
          //rec['document'] = await sails.helpers.aws.uploadFile(inputs.document.file,'stores', inputs.document.type);
          // let all_docs = [];
          // inputs.document.forEach(function (url) {
          //   let doc = {};
          //   doc["store_id"] = store.id;
          //   doc["document"] = url;
          //   all_docs.push(doc);
          // });
          // await Store_document.createEach(all_docs).exec(function createCB(
          //   err,
          //   created
          // ) {
          //   if (err) {
          //     sails.log.error(
          //       `error in attaching subcategory to store,Error: ${err}`
          //     );
          //   }
          //   sails.log("subcategory(s) attached to store", created);
          // });
        }
        sails.log(`store created with id '${store.id}'`);

        query = `UPDATE stores SET location_coordinates = ST_GEOMFROMTEXT('POINT(${store.lng} ${store.lat})') WHERE id = ${store.id};`;
        console.log(await sails.sendNativeQuery(query));
        if (inputs.subcategories) {
          var all_subcats = [];

          if (inputs.categories) {
            inputs.categories.forEach(function (item) {
              let subcat = {};
              subcat["store_id"] = store.id;
              subcat["subcategory_id"] = item;
              all_subcats.push(subcat);
            });
          }
          inputs.subcategories.forEach(function (item) {
            let subcat = {};
            subcat["store_id"] = store.id;
            subcat["subcategory_id"] = item;
            all_subcats.push(subcat);
          });

          await Store_subcategory.createEach(all_subcats).exec(
            function createCB(err, created) {
              if (err) {
                sails.log.error(
                  `error in attaching subcategory to store,Error: ${err}`
                );
              }
              sails.log("subcategory(s) attached to store", created);
            }
          );
        }
        if (_.isObject(timings.custom)) {
          sails.log("adding custom timings for store");
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
        return exits.success({
          status: true,
          data: store,
          message:
            sails.config.strings[inputs.vendor.language].BUSINESS_REGISTERED,
        });
      }
    } catch (err) {
      sails.log.error(`Exception occured: ${err}`);
      return exits.serverError({
        status: false,
        message:
          sails.config.strings[inputs.vendor.language].UNABLE_TO_REGISTER,
      });
      // …
    }
  },
};
