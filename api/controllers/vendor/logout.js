module.exports = {
  friendlyName: "Logout",

  description: "Logout vendor.",

  inputs: {
    vendor: {
      type: "ref",
      required: true,
      description: "logged in vendor",
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
    sails.log("calling action vendor/logout");

    try {
      if (inputs.vendor.rc_email && inputs.vendor.device_token) {
        let rc_data = await sails.helpers.rocketChat.login(
          inputs.vendor.rc_email,
          global.rc_common_password
        );

        await sails.helpers.rocketChat.deletePushToken(
          rc_data.rc_id,
          rc_data.rc_auth_token,
          inputs.vendor.device_token
        );
      }
      var auth = await Token.find({ user_id: inputs.vendor.id })
        .sort("id DESC")
        .limit(1);
      await Store.updateOne({ id: inputs.vendor.store.id }).set({
        is_online: false,
      });
      await Vendor.updateOne({ id: inputs.vendor.id }).set({
        device_token: null,
      });
      // console.log(auth[0].token);
      if (auth[0]) {
        //  await sails.helpers.jwt.removeToken({token: auth[0].token});
      }

      return exits.success({
        status: true,
        message: sails.config.strings[inputs.vendor.language].LOGGED_OUT,
        data: [],
      });
    } catch (err) {
      sails.log.error(`Error in logging out. ${err}`);
      return exits.ok({
        status: false,
        message: sails.config.strings[inputs.vendor.language].UNABLE_TO_LOGOUT,
        data: [],
      });
    }
  },
};
