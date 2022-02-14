module.exports = {
  friendlyName: "Get active orders",

  description: "",

  inputs: {
    id: {
      type: "number",
      required: true,
    },
    role: {
      type: "string",
      required: true,
    },
  },

  exits: {
    success: {
      outputFriendlyName: "Active orders",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper general/get-active-orders");
    let orders = [];
    try {
      var statuses = await sails.helpers.getAllStatuses();

      let query = `
        SELECT DISTINCT(p.id)
        FROM users u
        INNER JOIN request_for_proposals rfp on u.id = rfp.user_id
        INNER JOIN request_for_proposal_store rfp_store on rfp.id = rfp_store.rfp_id
        INNER JOIN stores st ON rfp_store.store_id = st.id
        INNER JOIN proposals p ON rfp_store.id = p.rfp_store_id         
        LEFT JOIN proposal_driver pd ON pd.proposal_id = p.id
        `;
      switch (inputs.role) {
        case global.ROLE.USER: {
          query += ` WHERE rfp.user_id = ${inputs.id}`;
          break;
        }
        case global.ROLE.VENDOR: {
          query += ` WHERE st.id = ${inputs.id}`;
          break;
        }
        case global.ROLE.DRIVER: {
          query += ` WHERE pd.driver_id = ${inputs.id} 
          AND pd.status_id IN (${statuses[global.STATUS.ACCEPTED]},${
            statuses[global.STATUS.AT_PICKUP]
          },${statuses[global.STATUS.PICKED_UP]},
          ${statuses[global.STATUS.DELIVERY_STARTED]}
          ,${statuses[global.STATUS.AT_DELIVERY]}
          ,${statuses[global.STATUS.DELIVERY_CONFIRMED]})
          `;
          break;
        }
      }
      query += ` AND p.status_id NOT IN (${statuses[global.STATUS.COMPLETED]},${
        statuses[global.STATUS.CANCELLED]
      },${statuses[global.STATUS.EXPIRED]},${statuses[global.STATUS.PENDING]})
        `;

      sails.log(query);
      let result = await sails.sendNativeQuery(query);
      if (result.rows.length) {
        order_ids = _.map(result.rows, "id");
        orders = order_ids;

        if (inputs.role == global.ROLE.DRIVER) {
          orders = [];
          for (order of order_ids) {
            order = await sails.helpers.getDriverOrderRequest(
              inputs.id,
              order,
              statuses
            );
            orders.push(order);
            sails.log({ order: order });
          }
        }
      }

      return exits.success(orders);
    } catch (err) {
      sails.log.error(`Error in helper general/get-active-orders. ${err}`);
      return exits.success(orders);
    }
  },
};
