const moment = require("moment");
module.exports = {
  friendlyName: "Assign rider",

  description: "",

  inputs: {
    vendor: {
      type: "ref",
      required: true,
      description: "logged in vendor",
    },
    order_id: {
      type: "number",
      required: true,
    },
    driver_id: {
      type: "number",
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
    sails.log("calling action vendor/assign-driver");
    try {
      const driver = await sails.models.driver.findOne({
        id: inputs.driver_id,
        store_id: inputs.vendor.store.id,
      });
      if (!driver) {
        return exits.ok({
          status: false,
          message:
            sails.config.strings[inputs.vendor.language].INVALID_DRIVER_ID,
          data: [],
        });
      }
      if (
        driver.type == global.DRIVER_TYPE.ONLINE &&
        driver.is_online === false
      ) {
        return exits.ok({
          status: false,
          message:
            sails.config.strings[inputs.vendor.language].DRIVER_IS_OFFLINE,
          data: [],
        });
      }
      var query = `
      SELECT rfp_store.id as rfp_store_id,p.id as proposal_id,delivery_vehicle_id
      FROM proposals p 
      INNER JOIN request_for_proposal_store rfp_store 
        ON rfp_store.id = p.rfp_store_id
      WHERE rfp_store.store_id = ${inputs.vendor.store.id}
      AND p.id = ${inputs.order_id}
      `;
      const result = await sails.sendNativeQuery(query);
      if (result.rows.length) {
        const statuses = await sails.helpers.getAllStatuses();
        const order = result.rows[0];
        if (order.delivery_vehicle_id !== driver.vehicle_id) {
          return exits.ok({
            status: false,
            message:
              sails.config.strings[inputs.vendor.language]
                .DRIVER_HAS_DIFFERENT_VEHICLE,
            data: [],
          });
        }
        const already_assigned_other_order = await sails.models.proposal_driver
          .find({
            driver_id: inputs.driver_id,
            status_id: {
              "!=": [
                statuses.completed,
                statuses.rejected,
                statuses.payment_received,
                statuses.cancelled,
                statuses.expired,
              ],
            },
            proposal_id: { "!=": inputs.order_id },
          })
          .limit(1);
        if (already_assigned_other_order[0]) {
          return exits.ok({
            status: false,
            message:
              sails.config.strings[inputs.vendor.language]
                .ANOTHER_ORDER_ASSIGNED_TO_DRIVER_ALREADY,
            data: already_assigned_other_order[0],
          });
        }

        const already_assigned = await sails.models.proposal_driver.findOne({
          where: {
            proposal_id: order.proposal_id,
            driver_id: inputs.driver_id,
            status_id: { "!=": [statuses.expired] },
          },
        });

        var random = await sails.helpers.generateRandom.with({});
        var proposal_status =
          driver.type == global.DRIVER_TYPE.OFFLINE
            ? statuses.assigned_offline
            : statuses.assigned_online;
        if (already_assigned) {
          var updated = await sails.models.proposal_driver
            .updateOne({ id: already_assigned.id })
            .set({
              proposal_id: order.proposal_id,
              driver_id: inputs.driver_id,
              code: random,
              status_id: statuses.pending,
            });
        } else {
          var updated = await sails.models.proposal_driver
            .create({
              proposal_id: order.proposal_id,
              driver_id: inputs.driver_id,
              code: random,
              status_id: statuses.pending,
            })
            .fetch();
        }

        await Proposal.updateOne({
          id: order.proposal_id,
        }).set({ status_id: proposal_status });

        if (driver.type == global.DRIVER_TYPE.OFFLINE) {
          let user = await sails.helpers.getUserOfOrder(
            updated.proposal_id,
            "proposal"
          );
          sails.log(`sending push notification to user ${user.id}`);

          template = await sails.helpers.getNotificationTemplate(
            sails.config.notification.type.RIDER_ASSIGNED
          );

          business_name = await sails.helpers.convertHtmlIntoText(
            inputs.vendor.store.business_name
          );
          let title = template.meta[user.language];
          let body = template[user.language]
            .replace("{vendor}", business_name)
            .replace("{order_id}", inputs.order_id);
          let extra_data = JSON.stringify({
            proposal_id: updated.proposal_id || null,
            sent_by: {
              name: inputs.vendor.store.business_name,
              avatar: inputs.vendor.store.image,
            },
          });

          await sails.helpers.sendPushNotification(
            user.id,
            global.ROLE.USER,
            title,
            body,
            false,
            extra_data,
            sails.config.notification.type.RIDER_ASSIGNED
          );
          await sails.helpers.general.addNotification(
            user.id,
            global.ROLE.USER,
            title,
            body,
            extra_data,
            sails.config.notification.type.RIDER_ASSIGNED
          );

          await Order_status.updateOne({
            proposal_id: updated.proposal_id,
          }).set({
            order_picked: moment().format("YYYY-MM-DD HH:mm:ss"),
          });
        } else {
          template = await sails.helpers.getNotificationTemplate(
            sails.config.notification.type.ORDER_REQUEST_RECEIVED
          );
          business_name = await sails.helpers.convertHtmlIntoText(
            inputs.vendor.store.business_name
          );

          let title = template.meta[driver.language];
          let body = template[driver.language].replace(
            "{vendor}",
            business_name
          );

          let sent_by = await sails.helpers.getSentBy(
            inputs.vendor.store.id,
            business_name,
            inputs.vendor.store.image
          );
          let extra_data = JSON.stringify({
            id: updated.id || null,
            expiry_time: moment(updated.createdAt).add(
              process.env.ORDER_REQUEST_EXIPRY_DRIVER,
              "minutes"
            ),
            sent_by: sent_by,
          });

          await sails.helpers.sendPushNotification(
            inputs.driver_id,
            global.ROLE.DRIVER,
            title,
            body,
            false,
            extra_data,
            sails.config.notification.type.ORDER_REQUEST_RECEIVED
          );
          await sails.helpers.general.addNotification(
            inputs.driver_id,
            global.ROLE.DRIVER,
            title,
            body,
            extra_data,
            sails.config.notification.type.ORDER_REQUEST_RECEIVED
          );
        }
        return exits.success({
          status: true,
          message:
            sails.config.strings[inputs.vendor.language].ASSIGNED_TO_DRIVER,
          data: updated,
        });
      }
      return exits.ok({
        status: false,
        message: sails.config.strings[inputs.vendor.language].INVALID_ORDER_ID,
        data: [],
      });
    } catch (err) {
      sails.log(`Error assiging driver. Error: ${err}`);
      return exits.ok({
        status: false,
        message:
          sails.config.strings[inputs.vendor.language].UNABLE_TO_ASSIGN_DRIVER,
        data: [],
      });
    }
  },
};
