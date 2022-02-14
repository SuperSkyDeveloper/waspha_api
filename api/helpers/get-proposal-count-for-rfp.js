module.exports = {
  friendlyName: "Get proposal count for rfp",

  description: "",

  inputs: {
    rfp_id: {
      type: "number",
      required: true,
    },
  },

  exits: {
    success: {
      outputFriendlyName: "Proposal count for rfp",
    },
  },

  fn: async function (inputs, exits) {
    var query = `
    SELECT 
      COUNT(p.id) AS total_proposal FROM proposals p
    INNER JOIN request_for_proposal_store rfp_store 
      ON rfp_store.id = p.rfp_store_id
    WHERE rfp_store.rfp_id = ${inputs.rfp_id}
    AND p.status_id IS NOT NULL
    `;

    var result = await sails.sendNativeQuery(query);
    return exits.success(result.rows[0].total_proposal);
  },
};
