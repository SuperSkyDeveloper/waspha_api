module.exports = {
  friendlyName: "Update loyalty points",

  description: "",

  inputs: {
    id: {
      type: "number",
      required: true,
    },
    role: {
      type: "string",
      required: true,
    },
    loyalty_points: {
      type: "number",
      required: true,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper general/update-loyalty-points");
    try {
      let record = await sails.models[inputs.role].findOne({ id: inputs.id });
      if (record) {
        record = await sails.models[inputs.role]
          .updateOne({ id: inputs.id })
          .set({
            loyalty_points: record.loyalty_points + inputs.loyalty_points,
          });
        let extra_data = JSON.stringify({
          loyalty_points: record.loyalty_points,
        });
        await sails.helpers.sendPushNotification(
          inputs.id,
          inputs.role,
          "Loyalty points",
          "Loyalty points updated",
          true,
          extra_data,
          sails.config.notification.type.LOYALTY_POINTS_UPDATED
        );
        return exits.success(true);
      }
      return exits.success(false);
    } catch (err) {
      sails.log.error(`Error in helper general/update-loyalty-points. ${err}`);
      return exits.success(false);
    }
  },
};
