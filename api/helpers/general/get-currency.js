module.exports = {
  friendlyName: "Get currency",

  description: "",

  inputs: {
    id: {
      type: "number",
      required: true,
    },
    role: {
      type: "string",
      required: true,
    },
  },

  exits: {
    success: {
      outputFriendlyName: "Currency",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action general/get-currency");
    let currency = null;
    try {
      let result = null;
      switch (inputs.role) {
        case global.ROLE.VENDOR: {
          result = await Vendor_country.find({
            where: { vendor_id: inputs.id },
          })
            .populate("country_id")
            .limit(1);
          break;
        }
        case global.ROLE.USER: {
          result = await User_country.find({
            where: { user_id: inputs.id },
          })
            .populate("country_id")
            .limit(1);
          break;
        }
        case global.ROLE.DRIVER: {
          result = await Driver_country.find({
            where: { driver_id: inputs.id },
          })
            .populate("country_id")
            .limit(1);
          break;
        }
      }
      // sails.log(result[0]);
      if (result[0]) {
        currency = result[0].country_id.currency_code;
      }
      return exits.success(currency);
    } catch (err) {
      sails.log.error(`Error in helper general/get-avg-country. ${err}`);
      return exits.success(currency);
    }
  },
};
