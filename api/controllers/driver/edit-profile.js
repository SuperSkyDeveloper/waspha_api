module.exports = {
  friendlyName: "Edit profile",

  description: "",

  inputs: {
    driver: {
      type: "ref",
      required: true,
      description: "logged in driver",
    },
    name: {
      type: "string",
      required: false,
    },
    vehicle_id: {
      type: "number",
      required: false,
    },
    vehicle_name: {
      type: "string",
      required: false,
    },
    number_plate: {
      type: "string",
      required: false,
    },
  },

  exits: {
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("action driver/edit-profile started");
    const strings = sails.config.strings[inputs.driver.language];
    try {
      var rec = { ...inputs };
      delete rec.driver;
      sails.log({ rec, inputs });
      if (_.isEmpty(rec)) {
        return exits.ok({
          status: false,
          message: strings.NOTHING_TO_UPDATE,
        });
      }
      if (!_.isUndefined(inputs.delivery_vehicle_id)) {
        var vehicle = await Delivery_vehicle.findOne({
          id: inputs.delivery_vehicle_id,
        });
        if (!vehicle) {
          return exits.ok({
            status: false,
            message: strings.INVALID_VEHICLE_ID,
          });
        }
      }
      let driver = await Driver.updateOne({ id: inputs.driver.id }).set(rec);
      vehicle = await Delivery_vehicle.findOne({
        id: driver.vehicle_id,
      });
      sails.log("action driver/edit-profile ended");
      let data = {
        id: driver.id,
        name: driver.name,
        email: driver.email,
        contact: driver.contact,
        avatar: driver.avatar,
        vehicle: {
          id: driver.vehicle_id,
          name: driver.vehicle_name,
          number_plate: driver.number_plate,
        },
        is_approved: Boolean(driver.status),
        zone_option: driver.zone_option,
        is_zone_selected: Boolean(driver.is_zone_selected),
        free_zone_radius: driver.free_zone_radius,
        fixed_zone_id: null,
        message: null,
      };
      fixed_zone = await Driver_fixed_zone.find({
        driver_id: driver.id,
      }).limit(1);
      if (fixed_zone.length) {
        data.fixed_zone_id = fixed_zone[0].fixed_zone_id;
      }
      data.message = await sails.helpers.getMessageFromAdmin(
        driver.id,
        global.ROLE.DRIVER
      );
      return exits.success({
        status: true,
        message: strings.UPDATED,
        data: data,
      });
    } catch (err) {
      sails.log.error(`Error in action driver/edit-profile. ${err}`);
      return exits.ok({
        status: false,
        message: strings.UNABLE_TO_UPDATE,
      });
    }
  },
};
