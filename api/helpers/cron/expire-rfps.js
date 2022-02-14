module.exports = {
  friendlyName: "Expire rfps",

  description: "",

  inputs: {},

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper cron/expire-rfps");
    try {
      const statuses = await sails.helpers.getAllStatuses();
      await sails.helpers.sendNotificationOnRfpExpire(statuses);
      query = `
      UPDATE  request_for_proposals rfp
      SET rfp.status_id = ${statuses[global.STATUS.EXPIRED]}
      WHERE (rfp.createdAt  + INTERVAL ${
        process.env.EXPIRY_TIME_RFP
      } MINUTE) <  NOW()
      AND rfp.status_id IN (${statuses[global.STATUS.REQUIRE_QUEUE]},${
        statuses[global.STATUS.UPCOMING]
      })
      `;

      result = await sails.sendNativeQuery(query);
      // console.log({affectedRowsForExpireRFPs: result.affectedRows});
      return exits.success();
    } catch (err) {
      sails.log.error(`Error in helper cron/expire-rfps. ${err}`);
      return exits.success();
    }
  },
};
