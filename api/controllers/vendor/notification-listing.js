const strings = sails.config.strings;
const type = sails.config.notification.type;
module.exports = {
  friendlyName: "Notification listing",

  description: "",

  inputs: {
    vendor: {
      type: "ref",
      required: true,
      description: "logged in vendor",
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
    sails.log("calling action vendor/notification-listing");

    try {
      const templates_with_meta = await Notification_template.find().populate(
        "meta"
      );
      let notifications = await sails.models.vendor_notification
        .find({
          where: { vendor_id: inputs.vendor.id },
          select: [
            "id",
            "title",
            "body",
            "extra_data",
            "notification_type",
            "template_id",
            "is_read",
            "is_viewed",
          ],
        })
        .sort("id DESC");
      if (notifications.length) {
        notifications = await sails.helpers.changeKeys(notifications, {
          notification_type: "type",
        });
        for (notification of notifications) {
          sails.log({ notification: notification });
          notification.is_read = Boolean(notification.is_read);
          notification.is_viewed = Boolean(notification.is_viewed);
          template = _.findLast(templates_with_meta, {
            id: notification.template_id,
          });
          notification.title = template.meta[0][inputs.vendor.language];
          notification.body = template[inputs.vendor.language];

          if (notification.extra_data) {
            extra_data = JSON.parse(notification.extra_data);
          }
          switch (notification.type) {
            case type.ORDER_COMPLETED: {
              if (extra_data) {
                notification.body = notification.body.replace(
                  "{order_id}",
                  extra_data.proposal_id || ""
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
            case type.RFP_RECEIVED:
            case type.PROPOSAL_REJECTED:
            case type.PROPOSAL_REVISED:
            case type.PROPOSAL_ACCEPTED: {
              if (extra_data) {
                notification.body = notification.body.replace(
                  "{proposal_id}",
                  extra_data.id || ""
                );
                if (_.isUndefined(extra_data.sent_by)) {
                  // notification.body = notification.body.replace(
                  //   "{user}",
                  //   extra_data.sent_by.name
                  // );
                  rfp_user = await sails.helpers.getUserOfOrder(
                    extra_data.id,
                    "rfp"
                  );
                  extra_data.sent_by = {
                    name: rfp_user.name,
                    avatar: rfp_user.avatar,
                  };
                  notification.extra_data = JSON.stringify(extra_data);
                }
                notification.body = notification.body.replace(
                  "{user}",
                  extra_data.sent_by.name
                );
                sails.log({ notification: notification.body });
              }

              break;
            }
            case type.ACCOUNT_APPROVED: {
              if (extra_data) {
                status = extra_data.status || "";
                notification.body = notification.body.replace(
                  "{status}",
                  status
                );
                sails.log({ notification: extra_data });
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
            case type.RFP_CANCELLED: {
              if (extra_data) {
                notification.body = notification.body.replace(
                  "{rfp_id}",
                  extra_data.id || ""
                );
                if (!_.isUndefined(extra_data.sent_by)) {
                  notification.body = notification.body.replace(
                    "{user}",
                    extra_data.sent_by.name
                  );
                }
                sails.log({ notification: notification.body });
              }

              break;
            }
            case type.DRIVER_ORDER_REJECTED:
            case type.EXPRESS_DRIVER_ORDER_REJECTED: {
              if (extra_data) {
                notification.body = notification.body.replace(
                  "{order_id}",
                  extra_data.id || ""
                );

                sails.log({ notification: notification.body });
              }

              break;
            }
          }
        }
        sails.log({ aaa: strings[inputs.vendor.language].TOTAL_RECORDS_FOUND });
        return exits.success({
          status: true,
          message: strings[inputs.vendor.language].TOTAL_RECORDS_FOUND.replace(
            "{total}",
            notifications.length
          ).replace("{records}", "notifications"),
          data: notifications,
        });
      }
      return exits.ok({
        status: true,
        message: strings[inputs.vendor.language].NOT_FOUND,
        data: [],
      });
    } catch (err) {
      sails.log.error(
        `Error fetching notification listing for vendor_id ${inputs.vendor.id}. ${err}`
      );
      return exits.ok({
        status: true,
        message: strings[inputs.vendor.language].UNABLE_TO_FIND,
        data: [],
      });
    }
  },
};
