module.exports = {
  friendlyName: "Cancel order request",

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
    reasons: {
      type: "json",
      required: true,
    },
    description: {
      type: "string",
      required: false,
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
    sails.log("calling action driver/cancel-order-request");
    const statuses = await sails.helpers.getAllStatuses();
    var message = null;
    try {
      var o_request = await Proposal_driver.findOne({
        id: inputs.request_id,
        driver_id: inputs.driver.id,
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
      var proposal = o_request.proposal_id;
      o_request.proposal_id = proposal.id;

      var rec = {
        proposal_driver_id: inputs.request_id,
        reasons: JSON.stringify(inputs.reasons),
      };
      if (inputs.description) {
        rec.description = inputs.description;
      }
      penalty = await sails.helpers.getSetting("waspha_penalty_fee_driver");
      await Proposal_driver.updateOne({ id: inputs.request_id }).set({
        status_id: statuses.cancelled,
        penalty_fee: penalty[0].value,
      });
      await Proposal_driver_reason.create(rec);
      await Proposal.updateOne({ id: o_request.proposal_id }).set({
        status_id: statuses.accepted,
      });
      if (proposal.delivery_mode_id == 3) {
        ///waspha_express delivery mode,assign rider to this order
        await sails.helpers.assignDriverToOrder(
          proposal.id,
          proposal.delivery_vehicle_id
        );
      }

      message =
        sails.config.strings[inputs.driver.language].CANCELLED_SUCCESSFULLY;

      ///
      var vendor = await sails.helpers.getVendorOfOrder(
        proposal.id,
        "proposal",
        proposal.order_type
      );

      let notification_type =
        proposal.order_type == global.ORDER_TYPE.NORMAL &&
        proposal.delivery_mode_id == 3
          ? sails.config.notification.type.EXPRESS_DRIVER_ORDER_REJECTED
          : sails.config.notification.type.DRIVER_ORDER_REJECTED;
      var template = await sails.helpers.getNotificationTemplate(
        notification_type
      );

      title = template.meta[vendor.language];
      body = template[vendor.language].replace("{order_id}", proposal.id);
      extra_data = JSON.stringify({
        id: proposal.id || null,
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

      await sails.helpers.sendPushNotification(
        vendor.id,
        global.ROLE.VENDOR,
        title,
        body,
        false,
        extra_data,
        notification_type
      );

      // var user = await sails.helpers.getUserOfOrder(proposal.id, "proposal");
      // if (user) {
      //   title = template.meta[user.language];
      //   body = template[user.language].replace("{order_id}", proposal.id);

      //   await sails.helpers.general.addNotification(
      //     user.id,
      //     global.ROLE.USER,
      //     title,
      //     body,
      //     extra_data,
      //     sails.config.notification.type.DRIVER_ORDER_REJECTED
      //   );

      //   await sails.helpers.sendPushNotification(
      //     user.id,
      //     global.ROLE.USER,
      //     title,
      //     body,
      //     false,
      //     extra_data,
      //     sails.config.notification.type.DRIVER_ORDER_REJECTED
      //   );
      // }
      ///

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
