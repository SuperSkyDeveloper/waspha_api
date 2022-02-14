module.exports = {
  friendlyName: "Get commission object",

  description: "",

  inputs: {
    id: {
      type: "number",
      required: true,
    },
    model: {
      type: "string",
      defaultsTo: "rfp_store",
    },
  },

  exits: {
    success: {
      outputFriendlyName: "Commission object",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("helper get-commission-object start");
    let query = `SELECT wc.*
    FROM request_for_proposal_store rfp_store
    INNER JOIN request_for_proposals rfp
      ON rfp.id = rfp_store.rfp_id
    INNER JOIN user_country uc
      ON uc.user_id = rfp.user_id
    INNER JOIN waspha_commissions wc
      ON wc.country = uc.country_id
   `;
    switch (inputs.model) {
      case "rfp_store": {
        query += `  WHERE rfp_store.id = ${inputs.id}`;
        break;
      }
      case "rfp": {
        query += `  WHERE rfp.id = ${inputs.id}`;
        break;
      }
    }
    console.log(query);
    let result = await sails.sendNativeQuery(query);
    let commission = null;
    if (result.rows.length) {
      commission = result.rows[0];
    }
    sails.log("helper get-commission-object end");
    return exits.success(commission);
  },
};
