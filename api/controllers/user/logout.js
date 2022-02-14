module.exports = {
  friendlyName: "Logout",

  description: "Logout user.",

  inputs: {
    user: {
      type: "ref",
      required: true,
      description: "logged in user",
    },
  },

  exits: {
    serverError: {
      description: "send server error",
      responseType: "serverError",
    },
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action user/logout");

    try {
      if (inputs.user.rc_email && inputs.user.device_token) {
        let rc_data = await sails.helpers.rocketChat.login(
          inputs.user.rc_email,
          global.rc_common_password
        );

        await sails.helpers.rocketChat.deletePushToken(
          rc_data.rc_id,
          rc_data.rc_auth_token,
          inputs.user.device_token
        );
      }
      var auth = await Token.find({ user_id: inputs.user.id })
        .sort("id DESC")
        .limit(1);
      await User.updateOne({ id: inputs.user.id }).set({
        is_online: false,
        device_token: null,
      });
      // console.log(auth[0].token);
      if (auth[0]) {
        //  await sails.helpers.jwt.removeToken({token: auth[0].token});
      }

      return exits.success({
        status: true,
        message: sails.config.strings[inputs.user.language].LOGGED_OUT,
        data: [],
      });
    } catch (err) {
      sails.log.error(`Error in logging out. ${err}`);
      return exits.ok({
        status: false,
        message: sails.config.strings[inputs.user.language].UNABLE_TO_LOGOUT,
        data: [],
      });
    }
  },
};
