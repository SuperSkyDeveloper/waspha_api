module.exports = {
  friendlyName: "Respond order request",

  description: "",

  inputs: {
    driver: {
      type: "ref",
      required: true,
      description: "logged in driver",
    },
    request_id: {
      type: "number",
      required: true,
    },
    accept: {
      type: "boolean",
      required: true,
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
    sails.log("calling action driver/respond-order-request");
    const statuses = await sails.helpers.getAllStatuses();
    var message = null;
    try {
      var o_request = await Proposal_driver.findOne({
        id: inputs.request_id,
        driver_id: inputs.driver.id,
        status_id: statuses.pending,
      }).populate("proposal_id");
      if (!o_request) {
        return exits.ok({
          status: false,
          message:
            sails.config.strings[inputs.driver.language]
              .INVALID_ORDER_REQUEST_ID,
          data: [],
        });
      }
      let vendor = await sails.helpers.getVendorOfOrder(
        o_request.proposal_id.id,
        "proposal",
        o_request.proposal_id.order_type
      );
      let user = await sails.helpers.getUserOfOrder(
        o_request.proposal_id.id,
        "proposal"
      );
      if (inputs.accept === true) {
        if (vendor.order_type == global.ORDER_TYPE.TRADITIONAL) {
          //send silent notification to vendor
          let extra_data = JSON.stringify({
            id: o_request.proposal_id.id,
          });
          if (o_request.proposal_id.delivery_mode_id == 3) {
            template = await sails.helpers.getNotificationTemplate(
              sails.config.notification.type.EXPRESS_DRIVER_FOUND
            );
            title = template.meta[vendor.language];
            body = template[vendor.language];
            await sails.helpers.sendPushNotification(
              vendor.id,
              global.ROLE.VENDOR,
              title,
              body,
              false,
              extra_data,
              sails.config.notification.type.DRIVER_FOUND
            );
          }
        } else {
          //normal order,so send notification to user

          sails.log({ user: user, vendor: vendor });

          template = await sails.helpers.getNotificationTemplate(
            sails.config.notification.type.RIDER_ASSIGNED
          );

          business_name = await sails.helpers.convertHtmlIntoText(
            vendor.business_name
          );
          title = template.meta[user.language];

          body = template[user.language]
            .replace("{vendor}", business_name)
            .replace("{order_id}", o_request.proposal_id.id);
          extra_data = JSON.stringify({
            proposal_id: o_request.proposal_id.id || null,
            sent_by: {
              name: business_name,
              avatar: vendor.image,
            },
          });
          await sails.helpers.general.addNotification(
            user.id,
            global.ROLE.USER,
            title,
            body,
            extra_data,
            sails.config.notification.type.RIDER_ASSIGNED
          );

          await sails.helpers.sendPushNotification(
            user.id,
            global.ROLE.USER,
            title,
            body,
            false,
            extra_data,
            sails.config.notification.type.RIDER_ASSIGNED
          );
        }

        await Proposal_driver.updateOne({ id: inputs.request_id }).set({
          status_id: statuses.accepted,
        });

        if (inputs.driver.type == global.DRIVER_TYPE.WASPHA_EXPRESS) {
          assigned_status = statuses[global.STATUS.ASSIGNED_WASPHA];
        } else {
          assigned_status = statuses[`assigned_${inputs.driver.type}`];
        }
        await Proposal.updateOne({ id: o_request.proposal_id.id }).set({
          status_id: assigned_status,
        });
        message =
          sails.config.strings[inputs.driver.language].ACCEPTED_SUCCESSFULLY;

        extra_data = JSON.stringify({
          id: o_request.proposal_id.id,
        });
        notification_type =
          o_request.proposal_id.delivery_mode_id == 3 &&
          o_request.proposal_id.order_type == global.ORDER_TYPE.NORMAL
            ? sails.config.notification.type.EXPRESS_DRIVER_FOUND
            : sails.config.notification.type.DRIVER_FOUND;

        template = await sails.helpers.getNotificationTemplate(
          sails.config.notification.type.EXPRESS_DRIVER_FOUND
        );
        title = template.meta[vendor.language];
        body = template[vendor.language];
        await sails.helpers.sendPushNotification(
          vendor.id,
          global.ROLE.VENDOR,
          title,
          body,
          false,
          extra_data,
          notification_type
        );
        await sails.helpers.sendPushNotification(
          vendor.id,
          global.ROLE.VENDOR,
          "driver found",
          "driver found",
          true,
          extra_data,
          notification_type
        );
      } else {
        await Proposal_driver.updateOne({ id: inputs.request_id }).set({
          status_id: statuses.rejected,
        });
        if (o_request.proposal_id.delivery_mode_id == 3) {
          ///waspha_express delivery mode,assign rider to this order
          await sails.helpers.assignDriverToOrder(
            o_request.proposal_id.id,
            o_request.proposal_id.delivery_vehicle_id
          );
        }
        message =
          sails.config.strings[inputs.driver.language].REJECTED_SUCCESSFULLY;

        ///need to notify to vendor

        notification_type =
          o_request.proposal_id.delivery_mode_id == 3
            ? sails.config.notification.type.EXPRESS_DRIVER_ORDER_REJECTED
            : sails.config.notification.type.DRIVER_ORDER_REJECTED;
        template = await sails.helpers.getNotificationTemplate(
          notification_type
        );

        title = template.meta[vendor.language];
        body = template[vendor.language].replace(
          "{order_id}",
          o_request.proposal_id.id
        );
        extra_data = JSON.stringify({
          id: o_request.proposal_id.id || null,
          sent_by: {
            name: inputs.driver.name,
            avatar: inputs.driver.avatar,
          },
        });
        await sails.helpers.general.addNotification(
          vendor.id,
          global.ROLE.VENDOR,
          title,
          body,
          extra_data,
          notification_type
        );

        // template = await sails.helpers.getNotificationTemplate(
        //   notification_type
        // );

        // title = template.meta[user.language];
        // body = template[user.language].replace(
        //   "{order_id}",
        //   o_request.proposal_id.id
        // );

        // await sails.helpers.sendPushNotification(
        //   user.id,
        //   global.ROLE.USER,
        //   title,
        //   body,
        //   false,
        //   extra_data,
        //   sails.config.notification.type.DRIVER_ORDER_REJECTED
        // );
        // await sails.helpers.sendPushNotification(
        //   user.id,
        //   global.ROLE.USER,
        //   title,
        //   body,
        //   true,
        //   extra_data,
        //   sails.config.notification.type.DRIVER_ORDER_REJECTED
        // );
      }
      return exits.success({
        status: true,
        message: message,
        data: [],
      });
    } catch (err) {
      sails.log.error(
        `Error in responding order request id ${inputs.request_id}. ${err}`
      );
      return exits.ok({
        status: false,
        message: sails.config.strings[inputs.driver.language].UNABLE_TO_PROCESS,
        data: [],
      });
    }
  },
};
