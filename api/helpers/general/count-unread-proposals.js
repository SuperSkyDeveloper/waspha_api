module.exports = {


  friendlyName: 'Count unread proposals',


  description: '',


  inputs: {
    id: {
      type: 'number',
      required: true
    },
    role: {
      type: 'string',
      required: true
    },
    status: {
      type: 'json',
      required: false,

    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs, exits) {
    let count = 0;
    let query = `
      SELECT COUNT(p.id) as count
      FROM proposals p
      INNER JOIN request_for_proposal_store rfp_store
        ON rfp_store.id = p.rfp_store_id
      INNER JOIN statuses s
        ON s.id = p.status_id
      WHERE p.is_read = 0      
    `
    switch(inputs.role){
      case global.ROLE.VENDOR: {
        query += ` AND rfp_store.store_id = ${inputs.id}`;
        break;
      }
    }
    if(!_.isUndefined(inputs.status)){
      query += ` AND s.slug IN ('${ inputs.status.join("','") }')`;
    }
    
    try{
      let result = await sails.sendNativeQuery(query);
      if(result.rows.length){
        count = result.rows[0].count
      }
      
      return exits.success(count);
    }catch(err){
      sails.log.error(`Error in helper count-unread-proposals. ${err}`)
      return exits.success(count);
    }    
   
  }


};

