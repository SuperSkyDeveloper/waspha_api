const type = sails.config.notification.type;
module.exports = {
  friendlyName: "Notification listing",

  description: "",

  inputs: {
    user: {
      type: "ref",
      required: true,
      description: "logged in user",
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
    sails.log("calling action user/notification-listing");
    const strings = sails.config.strings[inputs.user.language];
    try {
      const templates_with_meta = await Notification_template.find().populate(
        "meta"
      );
      let notifications = await User_notification.find({
        where: { user_id: inputs.user.id },
        select: [
          "id",
          "title",
          "body",
          "template_id",
          "extra_data",
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
          notification.title = template.meta[0][inputs.user.language];
          notification.body = template[inputs.user.language];
          if (notification.extra_data) {
            extra_data = JSON.parse(notification.extra_data);
          }
          sails.log(extra_data.sent_by);
          switch (notification.type) {
            case type.RIDER_ASSIGNED:
            case type.DELIVERY_MODE_CHANGED:
            case type.DRIVER_ORDER_REJECTED:
            case type.PROPOSAL_RECEIVED:
            case type.ORDER_COMPLETED: {
              if (extra_data) {
                notification.body = notification.body.replace(
                  "{order_id}",
                  extra_data.id || ""
                );
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
            case type.RFP_EXPIRED:
            case type.RFP_REJECTED: {
              if (extra_data) {
                notification.body = notification.body.replace(
                  "{rfp_id}",
                  extra_data.rfp_id || ""
                );
                if (
                  !_.isUndefined(extra_data.sent_by) &&
                  !_.isEmpty(extra_data.sent_by)
                ) {
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
                notification.body = notification.body.replace(
                  "{order_id}",
                  extra_data.order_id || ""
                );
                if (!_.isUndefined(extra_data.sent_by)) {
                  notification.body = notification.body.replace(
                    "{reviewer}",
                    extra_data.sent_by.name
                  );
                }
                sails.log({ notification: notification.body });
              }

              break;
            }
          }

          // sails.log({ template: template });
        }
        return exits.success({
          status: true,
          message: strings.FOUND,
          data: notifications,
        });
      }
      return exits.ok({
        status: true,
        message: strings.FOUND,
        data: [],
      });
    } catch (err) {
      sails.log.error(
        `Error fetching notification listing for user_id ${inputs.user.id}. ${err}`
      );
      return exits.ok({
        status: true,
        message: strings.UNABLE_TO_FIND,
        data: [],
      });
    }
  },
};
