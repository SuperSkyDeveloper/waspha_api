module.exports = {
  friendlyName: "Traditional order listing",

  description: "",

  inputs: {
    vendor: {
      type: "ref",
      required: true,
      description: "logged in vendor",
    },
  },

  exits: {
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("action vendor/traditional-order-listing started");
    const strings = sails.config.strings[inputs.vendor.language];
    try {
      const statuses = await sails.helpers.getAllStatuses();

      let where = {
        deletedAt: null,
        order_type: global.ORDER_TYPE.TRADITIONAL,
        store_id: inputs.vendor.store.id,
        status_id: { "!=": statuses[global.STATUS.CANCELLED] },
      };
      let orders = await Proposal.find({
        where: where,
        select: ["id", "order_type", "status_id", "createdAt"],
      }).sort("createdAt desc");
      if (!orders.length) {
        sails.log("action vendor/traditional-order-listing ended");
        return exits.ok({
          status: false,
          message: strings.NOT_FOUND,
        });
      }
      for (order of orders) {
        order.status = await sails.helpers.getObjectKeyByValue(
          statuses,
          order.status_id
        );
        delete order.status_id;
        order.order_date = order.createdAt;
      }
      sails.log("action vendor/traditional-order-listing ended");
      return exits.success({
        status: true,
        message: strings.FOUND,
        data: orders,
      });
    } catch (err) {
      sails.log.error(
        `Error in action vendor/traditional-order-listing. ${err}`
      );
      return exits.ok({
        status: false,
        message: strings.NOT_FOUND,
      });
    }
  },
};
