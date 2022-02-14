module.exports = {
  friendlyName: "Get admin",

  description: "",

  inputs: {
    id: {
      type: "number",
      required: true,
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    sails.log("calling action admin/get-admin");
    const admin = await Admin.findOne({ id: inputs.id });
    return exits.success({
      status: true,
      message: "admin found successfully",
      data: admin,
    });
  },
};
