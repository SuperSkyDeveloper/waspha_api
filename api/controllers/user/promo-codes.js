module.exports = {
  friendlyName: "Promo codes",

  description: "",

  inputs: {
    user: {
      type: "ref",
      required: true,
      description: "logged in user",
    },
    type: {
      type: "string",
      required: false,
      allowNull: true,
      isIn: ["general", "specific"],
    },
  },

  exits: {
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action user/promo-codes");
    try {
      let promo_codes = await sails.helpers.general.getPromoCodes(
        inputs.user.id,
        global.ROLE.USER,
        inputs.type || null
      );
      if (promo_codes.length) {
        return exits.success({
          status: true,
          message: "",
          data: promo_codes,
        });
      }
      return exits.ok({
        status: true,
        message: "",
        data: [],
      });
    } catch (err) {
      sails.log(`Error in action user/promo-codes. ${err}`);
      return exits.ok({
        status: true,
        message: "",
        data: [],
      });
    }
  },
};
