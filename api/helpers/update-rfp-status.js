module.exports = {


  friendlyName: 'Update rfp status',


  description: '',


  inputs: {
    status_id: {
      type: 'number',
      required: true
    },
    proposal_id: {
      type: 'number',
      required: false,
      allowNull: true
    },
    rfp_id: {
      type: 'number',
      required: false
    },
   
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs, exits) {
    sails.log('calling helper update-rfp-status');
    try{
      let query = `UPDATE request_for_proposals rfp`
      if(inputs.proposal_id){
        query += `       
        INNER JOIN request_for_proposal_store rfp_store
          ON rfp_store.rfp_id = rfp.id
        INNER JOIN proposals p
          ON p.rfp_store_id = rfp_store.id
        SET rfp.status_id = ${inputs.status_id}
        WHERE p.id = ${inputs.proposal_id}
        `;
      }else if(inputs.rfp_id){
        query += `              
        SET rfp.status_id = ${inputs.status_id}
        WHERE rfp.id = ${inputs.rfp_id}
        `;
      }
      sails.log(query)
      await sails.sendNativeQuery(query);
      return exits.success();
    }catch(err){
      sails.log.error(`Error in  updating rfp status. ${err}`);
      return exits.success(false);
    }
  }


};

