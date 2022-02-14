module.exports = {


  friendlyName: 'Get proposal driver type',


  description: '',


  inputs: {
    id: {
      type: 'number',
      required: true
    }
  },


  exits: {

    success: {
      outputFriendlyName: 'Proposal driver type',
    },

  },


  fn: async function (inputs, exits) {
    sails.log('calling helper get-proposal-driver-type');
    let type = null;
    try{
      let query = `
        SELECT d.type,d.id
        FROM drivers d
        INNER JOIN proposal_driver pd
          ON pd.driver_id = d.id
        WHERE pd.proposal_id = ${inputs.id}
        AND pd.status_id NOT IN (4,5,8)
        LIMIT 1
      `;
      let result = await sails.sendNativeQuery(query);
      if(result.rows.length){
        type = result.rows[0].type
      }
      return exits.success(type);
    }catch(err){
      sails.log.error(`Error in helper get-proposal-driver-type`);
      return exits.success(type);
    }
  }


};

