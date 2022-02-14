module.exports = {
  friendlyName: "Store profile",

  description: "",

  inputs: {
    vendor: {
      type: "ref",
      required: true,
      description: "logged in vendor",
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
    sails.log("calling action vendor/store-profile");
    const strings = sails.config.strings[inputs.vendor.language];

    let stores = await Store.find({ vendor_id: inputs.vendor.id })
      .populate("slots")
      .limit(1);

    try {
      sails.log(`trying to fetch store details, store id: ${stores[0].id}`);
      let data = {};
      const store = stores[0];
      data.id = store.id;
      data.is_approved = inputs.vendor.status == 1 ? true : false;
      data.message = await sails.helpers.getMessageFromAdmin(
        inputs.vendor.id,
        global.ROLE.VENDOR
      );
      data.name = {
        en: store.business_name,
        ar: store.ar,
      };
      data.is_online = store.is_online;
      data.delivery = store.delivery;
      data.pickup = store.pickup;
      data.avatar = store.image;
      data.image = store.image;
      data.timings = store.timings;
      data.average_rating = await Store_review_rating.avg("rating").where({
        store_id: store.id,
      });
      data.proposal_prep_time = store.proposal_prep_time;
      data.proposal_selection_time = store.proposal_selection_time;
      data.location = {
        address: store.address,
        lat: store.lat,
        lng: store.lng,
      };
      if (store.timings === "custom") {
        if (store.slots.length) {
          data.timings = await sails.helpers.formatStoreTimings(
            store.slots,
            inputs.vendor.language
          );
        }
      }
      (data.phone = store.country_code + store.phone),
        (data.delivery_range = store.delivery_range);
      data.categories = [];
      data.subcategories = [];
      data.documents = [];
      let query = `
          SELECT c.id
          FROM store_subcategory sc
        INNER JOIN categories c
          ON c.id = sc.subcategory_id
        WHERE sc.store_id = ${store.id}
        AND c.parent_id IS NULL
        AND c.deletedAt IS NULL
      `;
      let result = await sails.sendNativeQuery(query);
      if (result.rows.length) {
        data.categories = _.map(result.rows, "id");
      }
      query = `
          SELECT c.id
          FROM store_subcategory sc
        INNER JOIN categories c
          ON c.id = sc.subcategory_id
        INNER JOIN categories pc
          ON pc.id = c.parent_id
        WHERE sc.store_id = ${store.id}
        AND c.parent_id IS NOT NULL
        AND c.deletedAt IS NULL
        AND pc.deletedAt IS NULL
        
      `;
      result = await sails.sendNativeQuery(query);
      if (result.rows.length) {
        data.subcategories = _.map(result.rows, "id");
      }
      let documents = await Store_document.find({ store_id: store.id });
      if (documents.length) {
        data.documents = _.map(documents, "document");
      }
      var unread_counts = {};
      var unviewed_counts = {};
      unread_counts.notifications = await sails.helpers.general.countUnreadNotifications(
        inputs.vendor.id,
        global.ROLE.VENDOR
      );
      unviewed_counts.notifications = await sails.helpers.general.countUnviewedNotifications(
        inputs.vendor.id,
        global.ROLE.VENDOR
      );
      unread_counts.orders = await sails.helpers.general.countUnreadRfps(
        inputs.vendor.store.id,
        global.ROLE.VENDOR,
        [global.STATUS.PENDING]
      );
      unread_counts.latest_orders = await sails.helpers.general.countUnreadProposals(
        inputs.vendor.store.id,
        global.ROLE.VENDOR,
        [
          global.STATUS.COMPLETED,
          global.STATUS.ASSIGNED_ONLINE,
          global.STATUS.ASSIGNED_OFFLINE,
          global.STATUS.CANCELLED,
        ]
      );
      unread_counts.dashboard = unread_counts.notifications;
      unread_counts.accepted_orders = await sails.helpers.general.countUnreadProposals(
        inputs.vendor.store.id,
        global.ROLE.VENDOR,
        [global.STATUS.ACCEPTED]
      );
      unread_counts.waspha_box = 8;
      data.unread_counts = unread_counts;
      data.unviewed_counts = unviewed_counts;

      data.average_rating = !_.isUndefined(data.average_rating)
        ? parseFloat(data.average_rating.toFixed(2))
        : 0;
      return exits.success({
        status: true,
        message: strings.FOUND,
        data: data,
      });
    } catch (err) {
      sails.log.error(`Error in fetching store details: ${err}`);
      return exits.serverError({
        status: false,
        message: strings.UNABLE_TO_FIND,
      });
    }
  },
};
