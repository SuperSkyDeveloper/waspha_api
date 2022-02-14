module.exports = {
  friendlyName: "Get user",

  description: "",

  inputs: {
    admin: {
      type: "ref",
      required: true,
      description: "Logged in admin",
    },
    id: {
      type: "number",
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
    sails.log("calling action admin/get-user");
    try {
      const user = await User.findOne({ id: inputs.id });
      if (!user) {
        return exits.ok({
          status: false,
          message: "user not found",
        });
      }
      if (inputs.admin.role.name == global.ROLE.ADMIN) {
        user_country = await sails.helpers.general.getCountry(
          user.id,
          global.ROLE.USER
        );
        if (user_country.id !== inputs.admin.country.id) {
          return exits.ok({
            status: false,
            message: "user not found",
          });
        }
      }
      return exits.success({
        status: true,
        message: "User found successfully",
        data: user,
      });
    } catch (err) {}
  },
};
