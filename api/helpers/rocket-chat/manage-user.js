module.exports = {
  friendlyName: "Manage user",

  description: "",

  inputs: {
    user_id: {
      type: "string",
      required: true,
    },
    password: {
      type: "string",
      required: false,
      defaultsTo: "123456",
    },
    role: {
      type: "string",
      required: true,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper rocket-chat/manage-user");
    let data = {};
    let user = null;
    let email = null;
    try {
      switch (inputs.role) {
        case global.ROLE.USER: {
          user = await User.findOne({
            where: { id: inputs.user_id },
            select: ["id", "name", "email", "rc_id", "rc_email"],
          });
          email = user.email;
          let n = email.lastIndexOf("@");
          email = email.substring(0, n) + "_u" + email.substring(n);
          break;
        }
        case global.ROLE.DRIVER: {
          user = await Driver.findOne({
            where: { id: inputs.user_id },
            select: ["id", "name", "email", "rc_id"],
          });
          email = user.email;
          let n = email.lastIndexOf("@");
          email = email.substring(0, n) + "_d" + email.substring(n);
          sails.log({ email111: email });

          break;
        }
        case global.ROLE.VENDOR: {
          user = await Vendor.findOne({
            where: { id: inputs.user_id },
            select: ["id", "name", "email", "rc_id"],
          });
          email = user.email;
          let n = email.lastIndexOf("@");
          email = email.substring(0, n) + "_v" + email.substring(n);
          sails.log({ email111: email });

          break;
        }
      }

      if (!user) {
        return exits.success(data);
      }
      if (!user.rc_id) {
        let rc_data = await sails.helpers.rocketChat.createUser(
          email,
          user.name,
          inputs.password
        );
        sails.log({ rc_datainmanageuser: rc_data });
        if (!_.isUndefined(rc_data.rc_id)) {
          await sails.models[inputs.role]
            .updateOne({ id: user.id })
            .set(rc_data);
          data = await sails.helpers.rocketChat.login(
            rc_data.rc_email,
            inputs.password
          );
        }
      } else {
        sails.log({ email: email });
        data = await sails.helpers.rocketChat.login(email, inputs.password);
      }
      return exits.success(data);
    } catch (err) {
      sails.log.error(`Error in helper rocket-chat/manage-user. ${err}`);
      return exits.success(data);
    }
  },
};
