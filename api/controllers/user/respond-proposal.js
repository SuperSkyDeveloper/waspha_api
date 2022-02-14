const moment = require("moment");
module.exports = {
  friendlyName: "Respond proposal",

  description: "",

  inputs: {
    user: {
      type: "ref",
      required: true,
      description: "logged in user",
    },
    proposal_id: {
      type: "number",
      required: true,
    },
    accept: {
      type: "boolean",
      required: true,
    },
    reasons: {
      type: "json",
      required: false,
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
    sails.log("calling action user/respond-proposal");
    let query = `
    SELECT p.id,p.delivery_mode_id,p.is_delivery_mode_changed,rfp.id AS rfp_id,s.vendor_id,rfp_store.is_specific,v.language AS v_language
    FROM proposals p
    INNER JOIN request_for_proposal_store rfp_store 
      ON p.rfp_store_id = rfp_store.id
    INNER JOIN stores s
      ON s.id = rfp_store.store_id
    INNER JOIN vendors v
      ON v.id = s.vendor_id
    INNER JOIN request_for_proposals rfp 
      ON rfp_store.rfp_id = rfp.id
    WHERE rfp.user_id = ${inputs.user.id}
    AND p.id = ${inputs.proposal_id}
    `;

    try {
      let accept = inputs.accept;
      let status =
        accept === true
          ? {
              en: "accepted",
              ar: "وافقت",
            }
          : {
              en: "rejected",
              ar: "مرفوض",
            };

      let result = await sails.sendNativeQuery(query);
      if (result.rows.length) {
        let vendor_id = result.rows[0].vendor_id;
        const statuses = await sails.helpers.getAllStatuses();
        let status_id = accept === true ? statuses.accepted : statuses.rejected;
        let is_delivery_mode_changed = false;
        let updated = await Proposal.updateOne({ id: inputs.proposal_id }).set({
          status_id: status_id,
          is_delivery_mode_changed: is_delivery_mode_changed,
        });
        if (accept === true) {
          var order_status = {
            proposal_id: inputs.proposal_id,
            order_accepted: moment().format("YYYY-MM-DD HH:mm:ss"),
          };
          await Order_status.updateOne({ proposal_id: inputs.proposal_id }).set(
            order_status
          );
          await Request_for_proposal.updateOne({
            id: result.rows[0].rfp_id,
          }).set({ status_id: statuses.upcoming });

          let template = await sails.helpers.getNotificationTemplate(
            sails.config.notification.type.PROPOSAL_ACCEPTED
          );

          let title = template.meta[result.rows[0].v_language];
          let body = template[result.rows[0].v_language]
            .replace("{proposal_id}", inputs.proposal_id)
            .replace("{user}", inputs.user.name);
          extra_data = JSON.stringify({
            id: updated.id || null,
            delivery_mode_id: updated.delivery_mode_id,
            sent_by: {
              name: inputs.user.name,
              avatar: inputs.user.avatar || null,
            },
          });

          if (updated.delivery_mode_id == 3) {
            ///waspha_express delivery mode,assign rider to this order
            await sails.helpers.assignDriverToOrder(
              updated.id,
              updated.delivery_vehicle_id
            );
          }
          await sails.helpers.sendPushNotification(
            vendor_id,
            global.ROLE.VENDOR,
            title,
            body,
            false,
            extra_data,
            sails.config.notification.type.PROPOSAL_ACCEPTED
          );
          await sails.helpers.general.addNotification(
            vendor_id,
            global.ROLE.VENDOR,
            title,
            body,
            extra_data,
            sails.config.notification.type.PROPOSAL_ACCEPTED
          );
        } else {
          if (result.rows[0].is_specific == true) {
            // await sails.helpers.updateRfpStatus({status_id: statuses.rejected, rfp_id: result.rows[0].rfp_id});
            await sails.helpers.updateRfpStatus(
              statuses.rejected,
              null,
              result.rows[0].rfp_id
            );
          }
          sails.log(`sending push notification to vendor id ${vendor_id}`);

          let template = await sails.helpers.getNotificationTemplate(
            sails.config.notification.type.PROPOSAL_REJECTED
          );
          let title = template.meta[result.rows[0].v_language];
          let body = template[result.rows[0].v_language]
            .replace("{proposal_id}", inputs.proposal_id)
            .replace("{user}", inputs.user.name);
          extra_data = JSON.stringify({
            id: inputs.proposal_id || null,
            sent_by: {
              name: inputs.user.name,
              avatar: inputs.user.avatar || null,
            },
          });

          await sails.helpers.sendPushNotification(
            vendor_id,
            global.ROLE.VENDOR,
            title,
            body,
            false,
            extra_data,
            sails.config.notification.type.PROPOSAL_REJECTED
          );
          await sails.helpers.general.addNotification(
            vendor_id,
            global.ROLE.VENDOR,
            title,
            body,
            extra_data,
            sails.config.notification.type.PROPOSAL_REJECTED
          );
        }
        return exits.success({
          status: true,
          message: sails.config.strings[
            inputs.user.language
          ].PROPOSAL_RESPONDED.replace(
            "{status}",
            status[inputs.user.language]
          ),
          data: updated,
        });
      }
      return exits.ok({
        status: false,
        message: sails.config.strings[inputs.user.language].INVALID_PROPOSAL_ID,
      });
    } catch (err) {
      sails.log.error(
        `Error responding proposal id ${inputs.proposal_id}. ${err}`
      );
      return exits.ok({
        status: false,
        message: sails.config.strings[inputs.user.language].INVALID_PROPOSAL_ID,
      });
    }
  },
};
