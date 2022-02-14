const moment = require("moment");

module.exports = {
  friendlyName: "Delete role",

  description: "",

  inputs: {
    admin: {
      type: "ref",
      required: true,
      description: "logged in admin",
    },
    id: {
      type: "number",
      required: true,
    },
  },

  exits: {
    invalid: {
      responseType: "unauthorized",
      description: "Send 401 if authentication failed",
    },
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action super-admin/delete-role");

    let role = await Role.findOne({ id: inputs.id });
    if (!role) {
      return exits.invalid({
        status: false,
        message: sails.config.strings[inputs.admin.language].INVALID_ROLE_ID,
        data: [],
      });
    }

    if (role.name === "super_admin") {
      return exits.ok({
        status: false,
        message:
          sails.config.strings[inputs.admin.language].ROLE_CANT_BE_DELETED,
      });
    }
    role = await Role.updateOne({ id: inputs.id }).set({
      deletedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    });
    return exits.success({
      status: true,
      message: sails.config.strings[inputs.admin.language].DELETED,
      data: [],
    });
  },
};
