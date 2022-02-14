module.exports = {
  friendlyName: "Send notification on rfp expire",

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
    try {
      const statuses = inputs.statuses;
      let query = `
        SELECT rfp.user_id AS id,rfp.id AS rfp_id,u.language 
        FROM request_for_proposals rfp
        INNER JOIN users u
          ON u.id = rfp.user_id
        WHERE (rfp.createdAt  + INTERVAL ${
          process.env.EXPIRY_TIME_RFP
        } MINUTE) <  NOW()
        AND rfp.status_id IN (${statuses[global.STATUS.REQUIRE_QUEUE]},${
        statuses[global.STATUS.UPCOMING]
      })
`;
      //sails.log(query);
      //#region sending push notification
      let result = await sails.sendNativeQuery(query);
      if (result.rows.length) {
        //user_ids = _.map(result.rows, "user_id");
        let template = await sails.helpers.getNotificationTemplate(
          sails.config.notification.type.RFP_EXPIRED
        );
        let extra_data = {
          sent_by: {
            name: "waspha",
            avatar: "https://waspha.s3.amazonaws.com/settings/RljflptR3z.png",
          },
        };
        for (user of result.rows) {
          title = template.meta[user.language];
          body = template[user.language].replace("{rfp_id}", user.rfp_id);
          extra_data.rfp_id = user.rfp_id;
          extra_data = JSON.stringify(extra_data);
          await sails.helpers.sendPushNotification(
            user.id,
            global.ROLE.USER,
            title,
            body,
            false,
            extra_data,
            sails.config.notification.type.RFP_EXPIRED
          );
          await sails.helpers.general.addNotification(
            user.id,
            global.ROLE.USER,
            title,
            body,
            extra_data,
            sails.config.notification.type.RFP_EXPIRED
          );
        }
      }

      //#endregion sending push notification
      return exits.success();
    } catch (err) {
      sails.log.error(`Error in helper cron/expire-proposals. ${err}`);
      return exits.success();
    }
  },
};
