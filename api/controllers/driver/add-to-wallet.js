module.exports = {
  friendlyName: "Add to wallet",

  description: "",

  inputs: {
    driver: {
      type: "ref",
      required: true,
      description: "logged in driver",
    },
    user_id: {
      type: "number",
      required: true,
    },
    amount: {
      type: "number",
      required: true,
      min: 0,
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
    sails.log("calling action driver/add-to-wallet");
    try {
      let user = await User.findOne({
        where: { id: inputs.user_id },
        select: ["wallet"],
      });
      if (!user) {
        return exits.ok({
          status: false,
          message: sails.config.strings[inputs.driver.language].INVALID_USER_ID,
          data: [],
        });
      }
      await User.updateOne({ id: inputs.user_id }).set({
        wallet: user.wallet + inputs.amount,
      });
      let title = "Wallet Update";
      let body = "An amount has been added to your wallet";
      let extra_data = JSON.stringify({
        wallet: user.wallet + inputs.amount || null,
      });

      await sails.helpers.sendPushNotification(
        inputs.user_id,
        global.ROLE.USER,
        title,
        body,
        true,
        extra_data,
        sails.config.notification.type.WALLET_ADDED
      );
      return exits.success({
        status: true,
        message: sails.config.strings[inputs.driver.language].ADDED_TO_WALLET,
        data: [],
      });
    } catch (err) {
      sails.log.error(
        `Error in adding wallet for user id ${inputs.user_id} by driver id ${inputs.driver.id}. ${err}`
      );
      return exits.ok({
        status: false,
        message: sails.config.strings[inputs.driver.language].UNABLE_TO_PROCESS,
        data: [],
      });
    }
  },
};
