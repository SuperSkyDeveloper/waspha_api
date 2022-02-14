module.exports = {
  friendlyName: "Get store todays earning",

  description: "",

  inputs: {
    store_id: {
      type: "number",
      required: true,
    },
  },

  exits: {
    success: {
      outputFriendlyName: "Store todays earning",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper get-store-todays-earning");
    let todays_earning = 0;
    // query = `
    // SELECT  SUM(todays_earning) AS todays_earning FROM (
    //   SELECT  SUM(i.price*i.quantity  + i.tax_ratio*i.price/100*i.quantity) AS todays_earning
    //   FROM proposals p
    //   INNER JOIN request_for_proposal_store rfp_store ON rfp_store.id = p.rfp_store_id
    //   INNER JOIN proposal_items i ON i.proposal_id = p.id
    //   INNER JOIN statuses s ON p.status_id = s.id
    //   WHERE rfp_store.store_id = ${inputs.store_id}  AND DATE(p.createdAt) = CURDATE()
    //   AND (s.slug = '${global.STATUS.COMPLETED}' OR (s.slug='${global.STATUS.ACCEPTED}' AND p.payment_method='${global.PAYMENT_METHOD.CARD}') )
    //   GROUP BY p.id
    //   ORDER BY p.createdAt DESC
    //   ) AS xyz
    // `;
    try {
      query = `
    SELECT p.id   FROM proposals p
      INNER JOIN request_for_proposal_store rfp_store ON rfp_store.id = p.rfp_store_id
      INNER JOIN proposal_items i ON i.proposal_id = p.id
      INNER JOIN statuses s ON p.status_id = s.id
    WHERE rfp_store.store_id = ${inputs.store_id}  AND DATE(p.createdAt) = CURDATE()
    AND (s.slug = '${global.STATUS.COMPLETED}' OR (s.slug='${global.STATUS.ACCEPTED}' AND p.payment_method='${global.PAYMENT_METHOD.CARD}') )          
   
    `;
      to_query = `  
    SELECT p.id FROM proposals p     
    INNER JOIN statuses s ON p.status_id = s.id
    WHERE p.store_id = ${inputs.store_id}  AND DATE(p.createdAt) = CURDATE()
    AND (s.slug = '${global.STATUS.COMPLETED}' OR (s.slug='${global.STATUS.ACCEPTED}' AND p.payment_method='${global.PAYMENT_METHOD.CARD}') )          
   
    `;
      var result = await sails.sendNativeQuery(query);
      let merged_result = [];
      if (result.rows.length) {
        merged_result = result.rows;
      }
      result = await sails.sendNativeQuery(to_query);
      if (result.rows.length) {
        merged_result = _.union(merged_result, result.rows);
      }
      if (merged_result.length) {
        for (order of merged_result) {
          credit_debit = await sails.helpers.vendor.calculateCreditDebit(
            order.id
          );
          todays_earning += credit_debit.total_earning;
        }
      }
    } catch (err) {}
    return exits.success(todays_earning);
  },
};
