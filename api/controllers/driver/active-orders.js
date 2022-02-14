module.exports = {
  friendlyName: "Active orders",

  description: "",

  inputs: {
    driver: {
      type: "ref",
      required: true,
      description: "logged in driver",
    },
  },

  exits: {
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action driver/active-orders");
    const strings = sails.config.strings[inputs.driver.language];
    let orders = [];
    let status = false;
    let message = strings.NOT_FOUND;
    try {
      orders = await sails.helpers.general.getActiveOrders(
        inputs.driver.id,
        global.ROLE.DRIVER
      );

      if (orders.length) {
        status = true;
        message = strings.FOUND;
      }
      return exits.success({
        status: status,
        message: message,
        data: orders,
      });
    } catch (err) {
      sails.log.error(`Error in action driver/active-orders.${err}`);
      return exits.ok({
        status: false,
        message: strings.NOT_FOUND,
      });
    }
  },
};
