module.exports = {
  friendlyName: "Fetch order info for notification",

  description: "",

  inputs: {
    proposal_id: {
      type: "number",
      required: true,
    },
    order_type: {
      type: "string",
      required: false,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper fetch-order-detail-info-for-notification");
    let data = {};
    try {
      let query = null;
      if (
        !_.isUndefined(inputs.order_type) &&
        inputs.order_type == global.ORDER_TYPE.TRADITIONAL
      ) {
        query = `  
        SELECT p.type,p.payment_method,p.delivery_fee,pd.driver_id,s.id AS s_id,s.vendor_id,
        s.business_name AS s_name,s.image AS s_image,NULL AS user_id
        FROM proposals p       
        INNER JOIN stores s
          ON s.id = p.store_id       
        LEFT JOIN proposal_driver pd
          ON pd.proposal_id = p.id AND pd.status_id NOT IN (1,4,5,8)`;
      } else {
        query = `
        SELECT p.type,p.payment_method,p.delivery_fee,pd.driver_id,rfp.user_id,s.id AS s_id,s.vendor_id,
        s.business_name AS s_name,s.image AS s_image
        FROM proposals p
        INNER JOIN request_for_proposal_store rfp_store
          ON rfp_store.id = p.rfp_store_id
        INNER JOIN stores s
          ON s.id = rfp_store.store_id
        INNER JOIN request_for_proposals rfp
          ON rfp.id = rfp_store.rfp_id
        LEFT JOIN proposal_driver pd
          ON pd.proposal_id = p.id AND pd.status_id NOT IN (1,4,5,8)`;
      }

      query += `WHERE p.id = ${inputs.proposal_id}
      `;
      let result = await sails.sendNativeQuery(query);
      if (result.rows.length) {
        data = result.rows[0];
      }
      return exits.success(data);
    } catch (err) {
      return exits.success(data);
    }
  },
};
