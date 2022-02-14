const moment = require("moment");
module.exports = {
  friendlyName: "Edit vendor",

  description: "",

  inputs: {
    admin: {
      type: "ref",
      description: "Logged in admin",
    },
    id: {
      type: "number",
      required: true,
    },
    business_name: {
      type: "string",
      required: true,
    },
    ar: {
      type: "string",
      required: true,
    },
    delivery_range: {
      type: "number",
      required: true,
    },
    proposal_prep_time: {
      type: "number",
      required: false,
    },
    proposal_selection_time: {
      type: "number",
      required: false,
    },
    delivery: {
      type: "boolean",
      required: true,
    },
    pickup: {
      type: "boolean",
      required: true,
    },
    is_fulltime: {
      type: "boolean",
      required: true,
    },
    slots: {
      type: "json",
      required: false,
    },
  },

  exits: {
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("action super-admin/edit-vendor started");
    const strings = sails.config.strings[inputs.admin.language];
    try {
      let slots = inputs.slots || [];
      delete inputs.slots;
      inputs.timings = inputs.is_fulltime == true ? "fulltime" : "custom";
      delete inputs.is_fulltime;
      let store = await Store.updateOne({ id: inputs.id }).set(inputs);
      sails.log(inputs);
      if (slots.length) {
        await Store_timing.destroy({ store_id: inputs.id });
        for (slot of slots) {
          if (slot.from && slot.to) {
            temp = {};
            temp.store_id = store.id;
            temp.day = slot.day;
            temp.from = moment(slot.from).format("YYYY-MM-DD HH:mm:ss");
            temp.to = moment(slot.to).format("YYYY-MM-DD HH:mm:ss");

            await Store_timing.create(temp);
          }
        }
      }
      return exits.success({
        status: true,
        message: strings.UPDATED,
        data: store,
      });
    } catch (err) {
      sails.log.error(`Error in action super-admin/edit-vendor. ${err}`);
      return exits.ok({
        status: false,
        message: strings.UNABLE_TO_UPDATE,
      });
    }
  },
};
