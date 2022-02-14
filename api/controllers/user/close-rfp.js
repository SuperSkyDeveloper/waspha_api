module.exports = {


  friendlyName: 'Close rfp',


  description: '',


  inputs: {
    user: {
      type: 'ref',
      required: true,
      description: 'logged in user'
    },    
    rfp_id: {
      type: 'number',
      required: true
    },
    close:{
      type: 'boolean',
      required: true
    }
  },


  exits: {
    ok:{
      description:"Send ok response",
      responseType:"ok"
    },
    serverError:{
      description:"send server error",
      responseType:"serverError"
    },
  },


  fn: async function (inputs, exits) {
    sails.log('calling action user/close-rfp');
    try{
      const statuses = await sails.helpers.getAllStatuses();
      const rfp = await Request_for_proposal.findOne({id: inputs.rfp_id, user_id: inputs.user.id});
      if(!rfp){
        return exits.ok({
          status: false,
          message: sails.config.strings[inputs.user.language].INVALID_RFP_ID,
          data: []
        })
      }
      let status_id = null;
      let query = null;
      if(inputs.close === true){
        status_id = statuses[global.STATUS.CLOSED];    
        query = `
          UPDATE
          proposals p
          INNER JOIN request_for_proposal_store rfp_store
            ON rfp_store.id = p.rfp_store_id
          INNER JOIN request_for_proposals rfp
            ON rfp.id = rfp_store.rfp_id
          SET p.status_id = ${statuses[global.STATUS.CLOSED]}
          WHERE rfp.id = ${rfp.id}
          AND p.status_id = ${statuses[global.STATUS.PENDING]}

        `    
      }else{
        status_id = statuses[global.STATUS.REQUIRE_QUEUE];
      }
      await Request_for_proposal.updateOne({id: rfp.id}).set({status_id: status_id});
      if(query){
        await sails.sendNativeQuery(query);
      }
      return exits.success({
        status: true,
        message: sails.config.strings[inputs.user.language].PROCESSED_SUCCESSFULLY,
        data: []
      })
    }catch(err){
      sails.log.error(`Error in close-rfp for user_id: ${inputs.user.id}, rfp_id: ${inputs.rfp_id}`);
      return exits.ok({
        status: false,
        message: sails.config.strings[inputs.user.language].UNABLE_TO_PROCESS,
        data: []
      })

    }

  }


};
