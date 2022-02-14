const moment = require("moment");
module.exports = {
  friendlyName: "Cancel rfp",

  description: "",

  inputs: {
    user: {
      type: "ref",
      required: true,
      description: "logged in user",
    },
    rfp_id: {
      type: "number",
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
    sails.log("calling action user/cancel-rfp");
    sails.log({ inputs: inputs });

    try {
      const rfp = await Request_for_proposal.findOne({
        where: {
          id: inputs.rfp_id,
          user_id: inputs.user.id,
        },
        select: ["id", "status_id"],
      });
      if (!rfp) {
        sails.log(`RFP with id ${inputs.rfp_id} not found`);
        return exits.ok({
          status: false,
          message: sails.config.strings[inputs.user.language].INVALID_RFP_ID,
          data: [],
        });
      }
      sails.log(`cancelling RFP with id '${rfp.id}'`);
      const statuses = await sails.helpers.getAllStatuses();
      let rec = { status_id: statuses.cancelled };
      console.log({ rfp: rfp });
      let query = `
        SELECT  DISTINCT(rfp.id) as rfp_id, rfp.createdAt as rfp_created_at,
        c.id as c_id,c.name as c_name,c.image as c_image
        FROM users u
        INNER JOIN request_for_proposals rfp on u.id = rfp.user_id                                    
        INNER JOIN categories c ON c.id = rfp.subcategory_id 
        WHERE rfp.id = ${rfp.id}                          
        AND rfp.status_id IN (${statuses[global.STATUS.CANCELLED]})    
        AND rfp.deletedAt IS NULL            
      `;
      let result = await sails.sendNativeQuery(query);
      if (result.rows.length) {
        rec.deletedAt = moment().format("YYYY-MM-DD HH:mm:ss");
      }
      const cancelled = await Request_for_proposal.updateOne({
        id: rfp.id,
      }).set(rec);
      if (cancelled) {
        if (!result.rows.length) {
          let vendors = await sails.helpers.getRfpVendors(rfp.id);
          if (vendors.length) {
            let extra_data = JSON.stringify({
              id: rfp.id || null,
              sent_by: { name: inputs.user.name, avatar: inputs.user.avatar },
            });
            // let script_str = `sails run sendBulk ${vendors.toString()} ${
            //   global.ROLE.VENDOR
            // } '${title}' '${body}' false '${extra_data}' ${
            //   sails.config.notification.type.RFP_CANCELLED
            // }`;
            // await sails.helpers.runScript(script_str);

            let template = await sails.helpers.getNotificationTemplate(
              sails.config.notification.type.RFP_CANCELLED
            );
            //send notification if not already cancelled
            for (vendor of vendors) {
              title = template.meta[vendor.language];
              body = template[vendor.language]
                .replace("{rfp_id}", rfp.id)
                .replace("{user}", inputs.user.name);
              await sails.helpers.sendPushNotification(
                vendor.id,
                global.ROLE.VENDOR,
                title,
                body,
                false,
                extra_data,
                sails.config.notification.type.RFP_CANCELLED
              );

              await sails.helpers.general.addNotification(
                vendor.id,
                global.ROLE.VENDOR,
                title,
                body,
                extra_data,
                sails.config.notification.type.RFP_CANCELLED
              );
            }
          }
        }

        sails.log(`Cancelled RFP with id '${rfp.id}'`);
        return exits.success({
          status: true,
          message: sails.config.strings[inputs.user.language].RFP_CANCELLED,
          data: [],
        });
      }
    } catch (err) {
      sails.log(`Error cancelling RFP with id ${inputs.rfp_id}, Error: ${err}`);
      return exits.serverError({
        status: false,
        message: sails.config.strings[inputs.user.language].INVALID_RFP_ID,
        data: [],
      });
    }
  },
};
