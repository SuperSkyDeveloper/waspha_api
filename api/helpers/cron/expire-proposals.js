module.exports = {
  friendlyName: "Expire proposals",

  description: "",

  inputs: {},

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper cron/expire-proposals");
    try {
      const statuses = await sails.helpers.getAllStatuses();
      let query = `     
        UPDATE proposals p
        SET p.status_id = ${statuses[global.STATUS.EXPIRED]}
        WHERE 
        p.status_id IN (${statuses[global.STATUS.PENDING]})
        AND p.is_revised = 0
        AND (p.proposal_selection_time IS NOT NULL AND (p.updatedAt  + INTERVAL p.proposal_selection_time MINUTE) <  NOW() OR p.proposal_selection_time IS  NULL AND (p.updatedAt  + INTERVAL ${
          process.env.EXPIRY_TIME_PROPOSAL
        } MINUTE) <  NOW()  )

      `;
      await sails.helpers.sendNotificationOnProposalExpire(statuses);
      sails.log(query);
      let result = await sails.sendNativeQuery(query);
      // console.log({affectedRowsForExpireProposals: result.affectedRows});
      return exits.success();
    } catch (err) {
      sails.log.error(`Error in helper cron/expire-proposals. ${err}`);
      return exits.success();
    }
  },
};
