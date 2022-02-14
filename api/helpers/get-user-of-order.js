module.exports = {
  friendlyName: "Get user of order",

  description: "",

  inputs: {
    id: {
      type: "number",
      required: true,
    },
    type: {
      trype: "string",
      required: true,
      isIn: ["rfp", "proposal", "store"],
    },
  },

  exits: {
    success: {
      outputFriendlyName: "User of order",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper get-user-of-order");
    try {
      let data = {};
      let query = `
      SELECT rfp.user_id as id,u.language,u.name,u.avatar
      FROM request_for_proposals rfp
      INNER JOIN users u
        ON u.id = rfp.user_id
      INNER JOIN request_for_proposal_store rfp_store
        ON rfp_store.rfp_id = rfp.id
      LEFT JOIN proposals p
        ON p.rfp_store_id =  rfp_store.id      
      `;
      switch (inputs.type) {
        case "rfp": {
          query += ` WHERE rfp.id = ${inputs.id}`;
          break;
        }
        case "proposal": {
          query += ` WHERE p.id = ${inputs.id}`;
          break;
        }
        case "store": {
          query += ` WHERE rfp_store.store_id = ${inputs.id}`;
          break;
        }
      }

      let result = await sails.sendNativeQuery(query);
      if (result.rows.length) {
        data = result.rows[0];
      }
      return exits.success(data);
    } catch (err) {
      sails.log.error(`Error in helper get-user-of-order. ${err}`);
    }
  },
};
