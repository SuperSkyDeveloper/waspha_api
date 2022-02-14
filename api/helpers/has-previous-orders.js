module.exports = {


  friendlyName: 'Has previous orders',


  description: '',


  inputs: {
    store_id: {
      type: 'number',
      required: true
    },
    user_id: {
      type: 'number',
      required: true
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs, exits) {
    sails.log('calling helper has-previous-orders');
    let count = 0;
    try{
      let query = `
        SELECT COUNT(p.id) AS total
        FROM request_for_proposal_store rfp_store
        INNER JOIN request_for_proposals rfp
          ON rfp.id = rfp_store.rfp_id
        INNER JOIN proposals p
          ON p.rfp_store_id = rfp_store.id
        WHERE 
        rfp.user_id = ${inputs.user_id}
        AND
        rfp_store.store_id IN (${inputs.store_id})
         AND p.status_id IN (2,3,16,17,25)
      `;
      let result = await sails.sendNativeQuery(query);
      if(result.rows.length){
        count = result.rows[0].total;
      }
      return exits.success(count);
    }catch(err){
      sails.log.error(`Error in getting previous order info, store id: ${inputs.store_id}, Error: ${err}`)
      return exits.success(count);
    }
  }


};

