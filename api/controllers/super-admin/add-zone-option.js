module.exports = {
  friendlyName: "Add zone option",

  description: "",

  inputs: {
    admin: {
      type: "ref",
      required: true,
      description: "Logged in admin",
    },
    driver_id: {
      type: "number",
      required: true,
    },
    zone_option: {
      type: "string",
      required: true,
      isIn: Object.values(global.ZONE_OPTION),
    },
  },

  exits: {
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("action super-admin/add-zone-option started");
    try {
      let driver = await Driver.findOne({ id: inputs.driver_id });
      if (!driver) {
        return exits.ok({
          status: false,
          message: "Invalid id",
        });
      }
      let existing_fixed_zones = await Driver_fixed_zone.find({
        driver_id: driver.id,
      }).limit(1);
      let to_update = { zone_option: inputs.zone_option };
      if (
        driver.zone_option == global.ZONE_OPTION.FIXED_ZONE &&
        inputs.zone_option == global.ZONE_OPTION.FREE_ZONE
      ) {
        //delete selected fixed zone of this driver
        await Driver_fixed_zone.destroy({ driver_id: driver.id });
        to_update.is_zone_selected = false;
      }
      if (
        driver.zone_option == global.ZONE_OPTION.FREE_ZONE &&
        inputs.zone_option == global.ZONE_OPTION.FIXED_ZONE
      ) {
        //delete selected free zone radius of this driver
        to_update.free_zone_radius = null;
        to_update.is_zone_selected = false;
      }
      if (
        driver.zone_option == global.ZONE_OPTION.ALL &&
        inputs.zone_option != null &&
        inputs.zone_option != global.ZONE_OPTION.ALL
      ) {
        if (inputs.zone_option == global.ZONE_OPTION.FIXED_ZONE) {
          to_update.free_zone_radius = null;
          if (!existing_fixed_zones.length) {
            to_update.is_zone_selected = false;
          }
        }
        if (inputs.zone_option == global.ZONE_OPTION.FREE_ZONE) {
          await Driver_fixed_zone.destroy({ driver_id: driver.id });
          if (!driver.free_zone_radius) {
            to_update.is_zone_selected = false;
          }
        }
      }

      driver = await Driver.updateOne({ id: driver.id }).set(to_update);
      let template = await sails.helpers.getNotificationTemplate(
        sails.config.notification.type.ACCOUNT_APPROVED
      );

      let title = template.meta[driver.language];

      let body = template[driver.language].replace("{status}", "accepted");
      let extra_data = JSON.stringify({
        sent_by: { name: "waspha", avatar: inputs.admin.avatar },
        id: driver.id || null,
        status: "accepted",
        zone_option: driver.zone_option,
      });

      await sails.helpers.sendPushNotification(
        driver.id,
        global.ROLE.DRIVER,
        title,
        body,
        false,
        extra_data,
        sails.config.notification.type.ACCOUNT_APPROVED
      );

      await sails.helpers.general.addNotification(
        driver.id,
        global.ROLE.DRIVER,
        title,
        body,
        extra_data,
        sails.config.notification.type.ACCOUNT_APPROVED
      );
      sails.log("action super-admin/add-zone-option ended");
      return exits.success({
        status: true,
        message: "Added successfully",
      });
    } catch (err) {
      sails.log.error(`Error in action super-admin/add-zone-option. ${err}`);
      return exits.ok({
        status: false,
        message: "Unable to add zone option",
      });
    }
  },
};
