module.exports = {
  friendlyName: "Profile",

  description: "Profile driver.",

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
    sails.log("calling action driver/profile");
    try {
      sails.log(inputs.driver);
      var data = {};
      data.id = inputs.driver.id;
      data.name = inputs.driver.name;
      data.email = inputs.driver.email;
      data.contact = {
        country_code: inputs.driver.country_code,
        number: inputs.driver.contact,
        is_verified: true,
      };
      data.avatar = inputs.driver.avatar;
      data.vehicle = {
        id: inputs.driver.vehicle_id,
        name: inputs.driver.vehicle_name,
        number_plate: inputs.driver.number_plate,
      };
      data.is_approved = Boolean(inputs.driver.status);
      data.zone_option = inputs.driver.zone_option;
      data.is_zone_selected = Boolean(inputs.driver.is_zone_selected);
      data.free_zone_radius = inputs.driver.free_zone_radius;
      data.fixed_zone_id = null;

      fixed_zone = await Driver_fixed_zone.find({
        driver_id: inputs.driver.id,
      }).limit(1);
      if (fixed_zone.length) {
        data.fixed_zone_id = fixed_zone[0].fixed_zone_id;
      }
      data.message = await sails.helpers.getMessageFromAdmin(
        inputs.driver.id,
        global.ROLE.DRIVER
      );
      return exits.success({
        status: true,
        message: sails.config.strings[inputs.driver.language].FOUND,
        data: data,
      });
    } catch (err) {
      sails.log.error(
        `Error in getting profile for driver id ${inputs.driver.id}. ${err}`
      );
      return exits.ok({
        status: false,
        message: sails.config.strings[inputs.driver.language].NOT_FOUND,
        data: [],
      });
    }
  },
};
