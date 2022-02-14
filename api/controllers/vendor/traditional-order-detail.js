module.exports = {
  friendlyName: "Traditional order detail",

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
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("action vendor/traditional-order-detail started");

    const strings = sails.config.strings[inputs.vendor.language];
    try {
      const statuses = await sails.helpers.getAllStatuses();
      let where = {
        id: inputs.id,
        deletedAt: null,
        order_type: global.ORDER_TYPE.TRADITIONAL,
        store_id: inputs.vendor.store.id,
      };
      let order = await Proposal.findOne({
        where: where,
        select: [
          "id",
          "order_type",
          "status_id",
          "pickup_location",
          "delivery_location",
          "package_charges",
          "createdAt",
        ],
      }).populate("items", {
        select: ["id", "title", "quantity", "requirements"],
      });
      if (!order) {
        sails.log("action vendor/traditional-order-detail ended");
        return exits.ok({
          status: false,
          message: strings.INVALID_ID,
        });
      }
      order.items = await sails.helpers.changeKeys(order.items, {
        requirements: "description",
      });
      order.pickup_location = JSON.parse(order.pickup_location);
      order.delivery_location = JSON.parse(order.delivery_location);
      order.order_date = order.createdAt;
      delete order.createdAt;
      order.status = await sails.helpers.getObjectKeyByValue(
        statuses,
        order.status_id
      );
      delete order.status_id;
      pd = await Proposal_driver.find({
        proposal_id: order.id,
        status_id: { "!=": [1, 4, 5, 8, 23] },
      })
        .limit(1)
        .populate("driver_id");
      order.driver = null;
      if (pd.length) {
        pd = pd[0];
        order.driver = {
          id: pd.driver_id.id,
          name: pd.driver_id.name,
          avg_rating: await sails.helpers.general.getAvgRating(
            pd.driver_id.id,
            global.ROLE.DRIVER
          ),
          location: {
            address: pd.driver_id.address,
            lat: pd.driver_id.lat,
            lng: pd.driver_id.lng,
          },
        };
      }
      return exits.success({
        status: true,
        message: strings.FOUND,
        data: order,
      });
    } catch (err) {
      sails.log.error(
        `Error in action vendor/traditional-order-detail. ${err}`
      );
      return exits.ok({
        status: false,
        message: strings.NOT_FOUND,
      });
    }
  },
};
