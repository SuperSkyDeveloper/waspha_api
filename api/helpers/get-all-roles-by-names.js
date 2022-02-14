module.exports = {
  friendlyName: "Get roles",

  description: "",

  inputs: {
    names: {
      type: "json",
      required: false,
    },
    ids: {
      type: "json",
      required: false,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helpers/get-all-roles-by-names");
    let where = { deletedAt: null };
    if (!_.isUndefined(inputs.ids)) {
      where.id = inputs.ids;
    }
    if (!_.isUndefined(inputs.names)) {
      where.name = inputs.names;
    }
    const roles = await Role.find(where);
    const all_roles = {};
    if (roles.length) {
      roles.forEach((role) => {
        all_roles[role.name] = role.id;
      });
    }
    return exits.success(all_roles);
  },
};
