module.exports = {
  friendlyName: "Update vendor subscription waspha express",

  description: "",

  inputs: {
    admin: {
      type: "ref",
      required: true,
      description: "logged in admin",
    },
    store_id: {
      type: "number",
      required: true,
    },
    is_waspha_express_subscribed: {
      type: "boolean",
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
    sails.log(
      "action super-admin/update-vendor-subscription-waspha-express started "
    );
    try {
      let store = await Store.findOne({ id: inputs.store_id });
      if (!store) {
        return exits.ok({
          status: false,
          message: "Invalid id",
          data: [],
        });
      }
      store = await Store.updateOne({ id: inputs.store_id }).set({
        is_waspha_express_subscribed: inputs.is_waspha_express_subscribed,
      });
      return exits.success({
        status: true,
        message: "Updated successfully",
        data: [],
      });
    } catch (err) {
      sails.log.error(
        `Error in action super-admin/update-vendor-subscription-waspha-express. ${err}`
      );
      return exits.ok({
        status: false,
        message: "Unable to update",
        data: [],
      });
    }
  },
};
