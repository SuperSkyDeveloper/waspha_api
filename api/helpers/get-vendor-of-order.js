module.exports = {
  friendlyName: "Get vendor of order",

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
    order_type: {
      type: "string",
      required: false,
    },
  },

  exits: {
    success: {
      outputFriendlyName: "vendor of order",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper get-vendor-of-order");
    try {
      let data = {};
      let query = null;
      if (
        !_.isUndefined(inputs.order_type) &&
        inputs.order_type == global.ORDER_TYPE.TRADITIONAL
      ) {
        query = `  
        SELECT v.name AS OWNER,v.language,v.rc_id,v.rc_username,s.vendor_id AS id,s.id AS s_id,s.lat,s.lng,s.business_name,s.image,s.country_code AS s_country_code,
        s.phone AS s_phone,p.order_type
        FROM proposals p      
            INNER JOIN stores s
          ON s.id = p.store_id
              INNER JOIN vendors v
          ON v.id = s.vendor_id
        `;
      } else {
        query = `
       SELECT v.name AS owner,v.language,v.rc_id,v.rc_username,s.vendor_id AS id,s.id AS s_id,s.lat,s.lng,s.business_name,s.image,s.country_code AS s_country_code,
       s.phone AS s_phone,p.order_type       
       FROM request_for_proposals rfp
       INNER JOIN request_for_proposal_store rfp_store
         ON rfp_store.rfp_id = rfp.id
       INNER JOIN stores s
         ON s.id = rfp_store.store_id
       INNER JOIN vendors v
         ON v.id = s.vendor_id
       LEFT JOIN proposals p
         ON p.rfp_store_id =  rfp_store.id      
       `;
      }
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
      sails.log.error(`Error in helper get-vendor-of-order. ${err}`);
    }
  },
};
