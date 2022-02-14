module.exports = {
  friendlyName: "Get country",

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
      outputFriendlyName: "Country",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action general/get-country");
    let country = 0;
    try {
      let result = null;
      switch (inputs.role) {
        case global.ROLE.ADMIN: {
          result = await Admin_country.find({
            where: { admin_id: inputs.id },
          })
            .populate("country_id")
            .limit(1);
          break;
        }
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
        country = result[0].country_id;
      }
      return exits.success(country);
    } catch (err) {
      sails.log.error(`Error in helper general/get-avg-country. ${err}`);
      return exits.success(country);
    }
  },
};
