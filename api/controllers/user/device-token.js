module.exports = {
  friendlyName: "Device token",

  description: "",

  inputs: {
    user: {
      type: "ref",
      required: true,
      description: "logged in user",
    },
    device_token: {
      type: "string",
      required: true,
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
    sails.log("calling action user/device-token");
    try {
      let previous_fcm_token = inputs.user.device_token;
      const updated = await sails.helpers.general.saveDeviceToken(
        inputs.user.id,
        inputs.device_token,
        global.ROLE.USER
      );
      if (updated === true) {
        if (inputs.user.rc_email) {
          let rc_data = await sails.helpers.rocketChat.login(
            inputs.user.rc_email,
            global.rc_common_password
          );

          if (previous_fcm_token) {
            await sails.helpers.rocketChat.deletePushToken(
              rc_data.rc_id,
              rc_data.rc_auth_token,
              previous_fcm_token
            );
          }
          if (!_.isUndefined(rc_data.rc_auth_token)) {
            let rc_data2 = await sails.helpers.rocketChat.savePushToken(
              rc_data.rc_id,
              rc_data.rc_auth_token,
              "gcm",
              inputs.device_token,
              process.env.ROCKET_CHAT_APP_NAME
            );
          }
        }
        return exits.success({
          status: true,
          message: sails.config.strings[inputs.user.language].UPDATED,
          data: [],
        });
      }
    } catch (err) {
      sails.log.error(
        `Error in  user/device-token for user id ${inputs.user.id}. Error: ${err}`
      );
      return exits.ok({
        status: false,
        message: sails.config.strings[inputs.user.language].UNABLE_TO_UPDATE,
        data: [],
      });
    }
  },
};
