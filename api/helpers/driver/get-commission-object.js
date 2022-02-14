module.exports = {
  friendlyName: "Get commission object driver",

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
      outputFriendlyName: "Commission object driver",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("helper driver/get-commission-object start");
    let query = `SELECT wc.*
    FROM drivers d    
    INNER JOIN driver_country dc
      ON dc.driver_id = d.id
    INNER JOIN waspha_commissions_driver wc
      ON wc.country = dc.country_id
    WHERE d.id = ${inputs.id}
   `;

    let result = await sails.sendNativeQuery(query);
    let commission = null;
    if (result.rows.length) {
      commission = result.rows[0];
    }
    sails.log("helper driver/get-commission-object end");
    return exits.success(commission);
  },
};
