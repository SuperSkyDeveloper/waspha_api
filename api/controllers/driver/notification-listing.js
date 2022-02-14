const type = sails.config.notification.type;
module.exports = {
  friendlyName: "Notification listing",

  description: "",

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
    sails.log("calling action driver/notification-listing");
    const strings = sails.config.strings[inputs.driver.language];
    try {
      const templates_with_meta = await Notification_template.find().populate(
        "meta"
      );
      let notifications = await Driver_notification.find({
        where: { driver_id: inputs.driver.id },
        select: [
          "id",
          "title",
          "body",
          "extra_data",
          "template_id",
          "notification_type",
        ],
      }).sort("id DESC");

      notifications = await sails.helpers.changeKeys(notifications, {
        notification_type: "type",
      });
      if (notifications.length) {
        for (notification of notifications) {
          template = _.findLast(templates_with_meta, {
            id: notification.template_id,
          });
          notification.title = template.meta[0][inputs.driver.language];
          notification.body = template[inputs.driver.language];

          if (notification.extra_data) {
            extra_data = JSON.parse(notification.extra_data);
          }
          switch (notification.type) {
            case type.ORDER_REQUEST_RECEIVED: {
              if (extra_data) {
                if (!_.isUndefined(extra_data.sent_by)) {
                  notification.body = notification.body.replace(
                    "{vendor}",
                    extra_data.sent_by.name
                  );
                }
                sails.log({ notification: notification.body });
              }

              break;
            }
            case type.REVIEW_RECEIVED: {
              if (extra_data) {
                if (!_.isUndefined(extra_data.sent_by)) {
                  notification.body = notification.body
                    .replace("{reviewer}", extra_data.sent_by.name)
                    .replace("{order_id}", extra_data.order_id);
                }
                sails.log({ notification: notification.body });
              }

              break;
            }
          }
        }
        return exits.success({
          status: true,
          message: strings.FOUND,
          data: notifications,
        });
      }
      return exits.ok({
        status: true,
        message: strings.NOT_FOUND,
        data: [],
      });
    } catch (err) {
      sails.log.error(
        `Error fetching notification listing for driver_id ${inputs.driver.id}. ${err}`
      );
      return exits.ok({
        status: true,
        message: strings.UNABLE_TO_FIND,
        data: [],
      });
    }
  },
};
