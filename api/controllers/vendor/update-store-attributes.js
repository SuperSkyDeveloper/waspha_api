module.exports = {
  friendlyName: "Update store attributes",

  description: "",

  inputs: {
    vendor: {
      type: "ref",
      required: true,
      description: "logged in vendor",
    },
    delivery: {
      type: "boolean",
      required: false,
    },
    pickup: {
      type: "boolean",
      required: false,
    },
    is_online: {
      type: "boolean",
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
    sails.log("calling action vendor/update-store-attributes");
    const strings = sails.config.strings[inputs.vendor.language];
    try {
      const rec = {};
      if (inputs.delivery !== "undefined") {
        rec.delivery = inputs.delivery;
      }
      if (inputs.pickup !== "undefined") {
        rec.pickup = inputs.pickup;
      }
      if (inputs.is_online !== "undefined") {
        rec.is_online = inputs.is_online;
      }

      if (rec) {
        const updated = await Store.updateOne({
          id: inputs.vendor.store.id,
        }).set(rec);
        if (updated) {
          return exits.success({
            status: true,
            message: strings.UPDATED,
            data: {
              delivery: updated.delivery,
              pickup: updated.pickup,
              is_online: updated.is_online,
            },
          });
        }
      }

      return exits.ok({
        status: false,
        message: strings.NOTHING_TO_UPDATE,
        data: [],
      });
    } catch (err) {
      sails.log.error(
        `Error changing availability mode for store id ${inputs.vendor.store.id}. Error: ${err}`
      );
      return exits.serverError({
        status: true,
        message: strings.UNABLE_TO_CHANGE_DELIVERY_MODE_AVAILABILITY,
        data: proposal,
      });
    }
  },
};
