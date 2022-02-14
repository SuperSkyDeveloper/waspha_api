/**
 * Request_for_proposal.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "request_for_proposals",
  primaryKey: "id",

  attributes: {
    id: {
      type: "number",
      autoIncrement: true,
    },
    user_id: {
      model: "user",
    },
    status_id: {
      model: "status",
    },
    subcategory_id: {
      model: "category",
    },
    delivery_location: {
      type: "string",
      required: false,
      allowNull: true,
    },
    delivery_mode_id: {
      model: "delivery_mode",
    },
    lat: {
      type: "number",
      columnType: "double",
      required: false,
      allowNull: true,
    },
    lng: {
      type: "number",
      columnType: "double",
      required: false,
      allowNull: true,
    },
    landmark: {
      type: "string",
      required: false,
      allowNull: true,
    },
    type: {
      type: "string",
      maxLength: 10,
      isIn: ["delivery", "pickup"],
      defaultsTo: "delivery",
    },
    scheduled_delivery_time: {
      type: "ref",
      columnType: "datetime",
      required: false,
    },
    items: {
      collection: "request_for_proposal_item",
      via: "rfp_id",
    },
    deletedAt: {
      type: "ref",
      columnType: "datetime",
      required: false,
    },

    stores: {
      collection: "store",
      via: "rfp_id",
      through: "request_for_proposal_store",
    },
  },
  beforeFind: function (a, b) {
    console.log("a:", a);
    console.log("b:", b);
  },
  // afterCreate: function (rfp, cb) {
  //  console.log("rfp(afterCreate):",rfp,rfp.stores)
  //   Request_for_proposal.find(rfp.stores, function (err, stores) {
  //       if (err) return cb(err);
  //       console.log("in afterCreate",stores[0])
  //       // async.each(stores, function (store, next) {
  //       //     store.status_id = 1;
  //       //   //  store.save(next);
  //       // }, cb);
  //   });

  // }
};
