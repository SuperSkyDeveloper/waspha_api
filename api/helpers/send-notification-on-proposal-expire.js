module.exports = {
  friendlyName: "Send notification on proposal expire",

  description: "",

  inputs: {
    statuses: {
      type: "json",
      required: true,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper send-notification-on-proposal-expire");
    try {
      const statuses = inputs.statuses;
      let query = `
      SELECT v.id,v.language,p.id AS proposal_id
      FROM proposals p
      INNER JOIN request_for_proposal_store rfp_store
        ON rfp_store.id = p.rfp_store_id
      INNER JOIN stores s
        ON s.id = rfp_store.store_id
      INNER JOIN vendors v
        ON v.id = s.vendor_id
        WHERE 
        p.status_id IN (${statuses[global.STATUS.PENDING]})
        AND p.is_revised = 0
        AND (p.proposal_selection_time IS NOT NULL AND (p.updatedAt  + INTERVAL p.proposal_selection_time MINUTE) <  NOW() OR p.proposal_selection_time IS  NULL AND (p.updatedAt  + INTERVAL ${
          process.env.EXPIRY_TIME_PROPOSAL
        } MINUTE) <  NOW()  )
      `;
      let result = await sails.sendNativeQuery(query);
      if (result.rows.length) {
        let template = await sails.helpers.getNotificationTemplate(
          sails.config.notification.type.PROPOSAL_EXPIRED
        );
        let extra_data = {
          sent_by: {
            name: "waspha",
            avatar:
              "https://waspha.s3.amazonaws.com/vendor/GU8AaH5zTFimage.jpeg",
          },
        };
        for (vendor of result.rows) {
          title = template.meta[vendor.language];
          body = template[vendor.language].replace(
            "{proposal_id}",
            vendor.proposal_id
          );
          extra_data.rfp_id = vendor.rfp_id;
          extra_data = JSON.stringify(extra_data);
          await sails.helpers.sendPushNotification(
            vendor.id,
            global.ROLE.VENDOR,
            title,
            body,
            false,
            extra_data,
            sails.config.notification.type.PROPOSAL_EXPIRED
          );
          await sails.helpers.general.addNotification(
            vendor.id,
            global.ROLE.VENDOR,
            title,
            body,
            extra_data,
            sails.config.notification.type.PROPOSAL_EXPIRED
          );
        }
      }
      return exits.success();
    } catch (err) {
      sails.log.error(`Error in send-notification-on-proposal-expire. ${err}`);
      return exits.success();
    }
  },
};
