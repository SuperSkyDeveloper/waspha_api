module.exports = {
  friendlyName: "Active orders",

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
    sails.log("calling action vendor/active-orders");
    const strings = sails.config.strings[inputs.vendor.language];
    let orders = [];
    let status = false;
    let message = strings.NOT_FOUND;
    try {
      orders = await sails.helpers.general.getActiveOrders(
        inputs.vendor.store.id,
        global.ROLE.VENDOR
      );

      if (orders.length) {
        status = true;
        message = strings.FOUND;
      }
      return exits.success({
        status: status,
        message: message,
        orders: orders,
      });
    } catch (err) {
      sails.log.error(`Error in action vendor/active-orders.${err}`);
      return exits.ok({
        status: false,
        message: strings.NOT_FOUND,
      });
    }
  },
};
