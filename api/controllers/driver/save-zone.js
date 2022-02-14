module.exports = {
  friendlyName: "Save zone",

  description: "",

  inputs: {
    driver: {
      type: "ref",
      required: true,
      description: "logged in driver",
    },
    fixed_zone_id: {
      type: "number",
      required: false,
    },
    free_zone_radius: {
      type: "number",
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
    sails.log("calling action driver/save-zone");
    const strings = sails.config.strings;
    const language = inputs.driver.language;
    try {
      if (
        _.isUndefined(inputs.fixed_zone_id) &&
        _.isUndefined(inputs.free_zone_radius)
      ) {
        return exits.ok({
          status: false,
          message: strings[language].PLEASE_SPECIFY_FIXED_ZONE_OR_FREE_ZONE,
        });
      }
      let zone_selected = false;
      if (!_.isUndefined(inputs.fixed_zone_id)) {
        let fixed_zone = await Fixed_zone.findOne({ id: inputs.fixed_zone_id });
        if (!fixed_zone) {
          return exits.ok({
            status: false,
            message: strings[language].INVALID_FIXED_ZONE_ID,
          });
        }
        await Driver_fixed_zone.updateOrCreate(
          { driver_id: inputs.driver.id },
          { driver_id: inputs.driver.id, fixed_zone_id: inputs.fixed_zone_id }
        );
        await Driver.updateOne({ id: inputs.driver.id }).set({
          free_zone_radius: null,
        });
        zone_selected = true;
      }
      if (!_.isUndefined(inputs.free_zone_radius)) {
        await Driver.updateOne({ id: inputs.driver.id }).set({
          free_zone_radius: inputs.free_zone_radius,
        });
        await Driver_fixed_zone.destroy({ driver_id: inputs.driver.id });
        zone_selected = true;
      }
      if (zone_selected) {
        await Driver.updateOne({ id: inputs.driver.id }).set({
          is_zone_selected: zone_selected,
        });
        return exits.success({
          status: true,
          message: strings[language].ZONE_SELECTED,
        });
      }
      return exits.ok({
        status: false,
        message: strings[language].UNABLE_TO_SELECT_ZONE,
      });
    } catch (err) {
      sails.log.error(`Error in action driver/save-zone. ${err}`);
    }
  },
};
