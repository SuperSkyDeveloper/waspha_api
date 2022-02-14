module.exports = {
  friendlyName: "Get vendor message",

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
  },

  exits: {
    success: {
      outputFriendlyName: "Get message from admin",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper get-message-from-admin");
    let where = { deletedAt: null };
    where[`${inputs.role}_id`] = inputs.id;
    let previous = await sails.models[`${inputs.role}_message`]
      .find(where)
      .limit(1)
      .sort("id DESC");

    let message = !_.isUndefined(previous[0]) ? previous[0].message : null;
    //sails.log({ previous: previous, message: message });
    return exits.success(message);
  },
};
