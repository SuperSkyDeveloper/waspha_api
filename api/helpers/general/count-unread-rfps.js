module.exports = {


  friendlyName: 'Count unread rfps',


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
      SELECT COUNT(rfp_store.id) as count
      FROM request_for_proposal_store rfp_store     
      INNER JOIN request_for_proposals rfp
        ON rfp.id = rfp_store.rfp_id   
      INNER JOIN statuses s
        ON s.id = rfp_store.status_id
      INNER JOIN statuses rs
        ON rs.id = rfp.status_id
      WHERE rfp_store.is_read = 0     
      AND rs.slug NOT IN ('${global.STATUS.EXPIRED}','${global.STATUS.CANCELLED}','${global.STATUS.CLOSED}','${global.STATUS.DELETED}','${global.STATUS.REJECTED}') 
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
      sails.log.error(`Error in helper count-unread-rfps. ${err}`)
      return exits.success(count);
    }
           
  }


};

