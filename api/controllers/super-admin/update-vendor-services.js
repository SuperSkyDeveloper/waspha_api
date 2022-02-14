module.exports = {
  friendlyName: "Update vendor subscription waspha express",

  description: "",

  inputs: {
    admin: {
      type: "ref",
      required: true,
      description: "logged in admin",
    },
    store: {
      type: "number",
      required: true,
    },
    waspha_box: {
      type: "boolean",
      required: false,
    },
    waspha_express: {
      type: "boolean",
      required: false,
    },
    delivery: {
      type: "boolean",
      required: false,
    },
    pickup: {
      type: "boolean",
      required: false,
    },
  },

  exits: {
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
    created: {
      description: "Send created response",
      responseType: "created",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("action super-admin/update-vendor-services started ");
    try {
      let store = await Store.findOne({ id: inputs.store });
      if (!store) {
        return exits.ok({
          status: false,
          message: "Invalid id",
          data: [],
        });
      }
      let rec = { ...inputs };
      store = await Store_service.updateOrCreate({ store: inputs.store }, rec);
      return exits.created({
        status: true,
        message: "Updated successfully",
        data: [],
      });
    } catch (err) {
      sails.log.error(
        `Error in action super-admin/update-vendor-services. ${err}`
      );
      return exits.ok({
        status: false,
        message: "Unable to update",
        data: [],
      });
    }
  },
};
