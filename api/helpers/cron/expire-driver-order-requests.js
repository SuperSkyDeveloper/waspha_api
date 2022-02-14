module.exports = {
  friendlyName: "Expire driver order requests",

  description: "",

  inputs: {},

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper cron/expire-driver-order-requests");
    try {
      const statuses = await sails.helpers.getAllStatuses();
      let query = `
      UPDATE proposal_driver  pd
      INNER JOIN proposals p
       ON p.id = pd.proposal_id
      SET pd.status_id = ${statuses.expired},
      p.status_id = ${statuses.accepted}
      WHERE pd.status_id = ${statuses.pending}
      AND TIMESTAMPDIFF(MINUTE, pd.createdAt ,NOW()) > ${process.env.ORDER_REQUEST_EXIPRY_DRIVER}
      `;

      let get_query = `
      SELECT p.id ,p.delivery_vehicle_id,delivery_mode_id
      FROM proposal_driver pd
      INNER JOIN proposals p
       ON p.id = pd.proposal_id    
       
      WHERE 
      p.delivery_mode_id = 3
      AND p.delivery_vehicle_id IS NOT NULL 
      AND pd.status_id = ${statuses.pending}
      AND TIMESTAMPDIFF(MINUTE, pd.createdAt ,NOW()) > ${process.env.ORDER_REQUEST_EXIPRY_DRIVER}
      `;

      let result = await sails.sendNativeQuery(get_query);
      let orders = result.rows;
      result = await sails.sendNativeQuery(query);

      if (orders.length) {
        //re-assign driver to orders having delivery mode waspha express
        for (order of orders) {
          await sails.helpers.assignDriverToOrder(
            order.id,
            order.delivery_vehicle_id
          );
        }
      }
      //console.log({affectedRowsForExpireDriverOrderRequests: result});
      return exits.success(true);
    } catch (err) {
      sails.log.error(`Error in helper expire-driver-order-requests. ${err}`);
      return exits.success(false);
    }
  },
};
