const { TokenExpiredError } = require("jsonwebtoken");

module.exports = {
  friendlyName: "Logout",

  description: "Logout driver.",

  inputs: {
    driver: {
      type: "ref",
      required: true,
      description: "logged in driver",
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
    sails.log("calling action driver/logout");
    try {
      if (inputs.driver.rc_email && inputs.driver.device_token) {
        let rc_data = await sails.helpers.rocketChat.login(
          inputs.driver.rc_email,
          global.rc_common_password
        );

        await sails.helpers.rocketChat.deletePushToken(
          rc_data.rc_id,
          rc_data.rc_auth_token,
          inputs.driver.device_token
        );
      }
      var auth = await Token.find({ user_id: inputs.driver.id })
        .sort("id DESC")
        .limit(1);
      await Driver.updateOne({ id: inputs.driver.id }).set({
        is_online: false,
        device_token: null,
      });
      // console.log(auth[0].token);
      if (auth[0]) {
        //  await sails.helpers.jwt.removeToken({token: auth[0].token});
      }

      return exits.success({
        status: true,
        message: sails.config.strings[inputs.driver.language].LOGGED_OUT,
        data: [],
      });
    } catch (err) {
      sails.log.error(`Error in logging out. ${err}`);
      return exits.ok({
        status: false,
        message: sails.config.strings[inputs.driver.language].UNABLE_TO_LOGOUT,
        data: [],
      });
    }
  },
};
