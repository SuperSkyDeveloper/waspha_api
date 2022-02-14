module.exports = {
  friendlyName: "Get rfp vendors",

  description: "",

  inputs: {
    rfp_id: {
      type: "number",
      required: true,
    },
  },

  exits: {
    success: {
      outputFriendlyName: "Rfp vendors",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper get-rfp-vendors");
    let data = [];
    try {
      let query = `
      SELECT v.id,v.language
      FROM stores s
      INNER JOIN vendors v
        ON v.id = s.vendor_id
      INNER JOIN request_for_proposal_store rfp_store
        ON rfp_store.store_id = s.id
      WHERE rfp_store.rfp_id = ${inputs.rfp_id}`;
      let result = await sails.sendNativeQuery(query);
      if (result.rows.length) {
        data = result.rows;
        /// data = result.rows.map((o) => o["vendor_id"]);
      }

      return exits.success(data);
    } catch (err) {
      sails.log.error(`Error in helper get-rfp-vendors. ${err}`);
      return exits.success(data);
    }
  },
};
