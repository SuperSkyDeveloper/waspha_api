module.exports = {
  friendlyName: "Get assigned stores",

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
    sails.log("calling action user/get-assigned-stores");

    let query = ` 
    SELECT s.id, s.business_name,s.lat,s.lng,s.image 
    FROM stores s
    INNER JOIN request_for_proposal_store rfp_store 
      ON rfp_store.store_id = s.id
    WHERE s.deletedAt IS NULL AND rfp_store.rfp_id = ${inputs.rfp_id}
    `;
    const result = await sails.sendNativeQuery(query);
    const total = result.rows.length;
    if (total) {
      return exits.success({
        status: true,
        message: sails.config.strings[
          inputs.user.language
        ].STORES_FOUND.replace("{total}", total),
        data: result.rows,
      });
    }
    return exits.ok({
      status: true,
      message: sails.config.strings[inputs.user.language].STORES_NOT_FOUND,
    });
  },
};
