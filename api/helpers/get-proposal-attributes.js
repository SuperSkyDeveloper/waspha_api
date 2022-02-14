module.exports = {


  friendlyName: 'Get proposal current status',


  description: '',


  inputs: {
    id: {
      type: 'number',
      required: true
    }
  },


  exits: {

    success: {
      outputFriendlyName: 'Proposal current status',
    },

  },


  fn: async function (inputs, exits) {
    sails.log('calling helper get-proposal-current-status');
    let data = {status: null, type: null};
    try{      
      let query = `
      SELECT s.slug AS status,p.type
      FROM statuses s
      INNER JOIN proposals p
        ON p.status_id = s.id
      WHERE p.id = ${inputs.id}
      `;
      let result = await sails.sendNativeQuery(query);
      if(result.rows.length){
        data.status = result.rows[0].status;
        data.type = result.rows[0].type;
      }
      return exits.success(data);
    }catch(err){
      sails.log.error(`Error in helper get-proposal-current-status. ${err}`);
      return exits.success(data);
    }
  }


};

