module.exports = {
  friendlyName: "Apply promo code",

  description: "",

  inputs: {
    user: {
      type: "ref",
      required: true,
      description: "logged in user",
    },
    proposal_id: {
      type: "number",
      required: true,
    },
    payment_method: {
      type: "string",
      required: true,
      //isIn: ['wallet','card','cash_on_delivery']
      isIn: _.values(global.PAYMENT_METHOD),
    },
    promo_code_id: {
      type: "number",
      required: true,
    },
  },

  exits: {
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action user/apply-promo-code");
    try {
      const statuses = await sails.helpers.getAllStatuses();

      let query = `      
        SELECT p.id,rfp.id AS rfp_id,s.id AS store_id,s.vendor_id,v.language AS v_language,rfp.type
        FROM proposals p
        INNER JOIN request_for_proposal_store rfp_store 
          ON p.rfp_store_id = rfp_store.id
        INNER JOIN stores s
          ON s.id = rfp_store.store_id        
        INNER JOIN vendors v
          ON v.id = s.vendor_id        
        INNER JOIN request_for_proposals rfp 
          ON rfp_store.rfp_id = rfp.id
        WHERE rfp.user_id = ${inputs.user.id}
        AND p.id = ${inputs.proposal_id}
        AND p.status_id = ${statuses.pending}
        `;
      let result = await sails.sendNativeQuery(query);
      if (!result.rows.length) {
        return exits.ok({
          status: false,
          message:
            sails.config.strings[inputs.user.language].INVALID_PROPOSAL_ID,
        });
      }

      let proposal = result.rows[0];
      sails.log({ rrr: proposal });
      let response = await sails.helpers.applyPromoCode(
        inputs.user,
        inputs.proposal_id,
        inputs.payment_method,
        inputs.promo_code_id
      );
      let data = {};
      data.status = response.status;
      data.message = response.message;
      if (!_.isUndefined(response.promo_code)) {
        data.promo_code = response.promo_code;
      }
      return exits.success(data);
    } catch (err) {
      sails.log(`Error in action user/apply-promo-code`);
    }
  },
};
