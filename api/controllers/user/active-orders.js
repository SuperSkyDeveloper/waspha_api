module.exports = {
  friendlyName: "Active orders",

  description: "",

  inputs: {
    user: {
      type: "ref",
      required: true,
      description: "logged in user",
    },
  },

  exits: {
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action user/active-orders");
    const strings = sails.config.strings[inputs.user.language];
    let orders = [];
    let status = false;
    let message = strings.NOT_FOUND;
    try {
      orders = await sails.helpers.general.getActiveOrders(
        inputs.user.id,
        global.ROLE.USER
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
      sails.log.error(`Error in action user/active-orders.${err}`);
      return exits.ok({
        status: false,
        message: strings.NOT_FOUND,
      });
    }
  },
};
