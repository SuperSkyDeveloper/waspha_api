function getAction() {
  sails.log("in getAction");
  _.each(sails.controllers, function (controller, controllerId) {
    _.each(controller, function (action, actionId) {
      if (
        actionId != "sails" ||
        _.isString(action) ||
        _.isBoolean(action) ||
        action === false
      ) {
        return;
      }

      console.log(controllerId + " " + actionId);
    });
  });
}
module.exports = {
  friendlyName: "Get vendor",

  description: "",

  inputs: {
    admin: {
      type: "ref",
      required: true,
      description: "Logged in admin",
    },
    id: {
      type: "number",
      required: true,
    },
  },

  exits: {
    notFound: {
      description: "send notFound response",
      responseType: "notFound",
    },
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action super-admin/get-vendor");
    getAction();
    try {
      let store = await Store.findOne({ id: inputs.id })
        .populate("vendor_id")
        .populate("slots")
        .populate("categories");
      if (!store) {
        return exits.notFound({
          status: false,
          message: "Not found",
        });
      }
      if (inputs.admin.role.name == global.ROLE.ADMIN) {
        vendor_country = await sails.helpers.general.getCountry(
          store.vendor_id.id,
          global.ROLE.VENDOR
        );
        if (vendor_country.id !== inputs.admin.country.id) {
          return exits.ok({
            status: false,
            message: "Not found",
          });
        }
      }

      store.business_name = await sails.helpers.convertHtmlIntoText(
        store.business_name
      );
      if (store.categories.length) {
        let cat_ids = _.map(store.categories, "subcategory_id");
        sails.log({ cats: store.categories, cat_ids: cat_ids });
        store.categories = await Category.find({
          where: { id: cat_ids },
          select: ["en", "ar"],
        });
        store.categories = store.categories.map(function (o) {
          o.name = {
            en: o.en,
            ar: o.ar,
          };
          delete o.en;
          delete o.ar;
          return o;
        });
      }
      store.is_online = Boolean(store.is_online);
      store.delivery = Boolean(store.delivery);
      store.pickup = Boolean(store.pickup);
      store.is_fulltime = store.timings == "fulltime";
      store.vendor = store.vendor_id;
      store.vendor.is_approved = Boolean(store.vendor.status);
      store.vendor.is_waspha_express_subscribed = Boolean(
        store.is_waspha_express_subscribed
      );
      if (store.slots) {
        const days = [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ];
        // store.formatted_slots = [];
        // let i = 1;
        // for (slot of store.slots) {
        //   temp = {};
        //   temp[`day`] = slot.day;
        //   temp[`day${i}`] = slot.day;
        //   temp[`from${i}`] = slot.from;
        //   temp[`to${i}`] = slot.to;
        //   store.formatted_slots.push(temp);
        //   store[`day${i}`] = day;
        //   i++;
        // }
        i = 1;
        for (day of days) {
          let slot = _.find(store.slots, { day: day });
          store[`day${i}`] = day;
          store[`from${i}`] = !_.isUndefined(slot) ? slot.from : null;
          store[`to${i}`] = !_.isUndefined(slot) ? slot.to : null;
          i++;
        }
      }

      documents = await Store_document.find({ store_id: store.id });
      store.documents = {};
      i = 1;
      for (doc of documents) {
        store.documents[`document${i++}`] = doc.document;
      }
      delete store.vendor.status;
      delete store.vendor_id;
      return exits.success({
        status: true,
        message: "",
        data: store,
      });
    } catch (err) {
      sails.log.error(`Error in action super-admin/get-vendor. ${err}`);
      return exits.notFound({
        status: false,
        message: "Unable to find",
      });
    }
  },
};
