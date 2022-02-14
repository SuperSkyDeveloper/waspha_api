module.exports = {


  friendlyName: 'Queue status',


  description: '',


  inputs: {
    user: {
      type: 'ref',
      required: true,
      description: 'logged in user'
    },
    id:{
      type: 'number',
      required: true
    },
  },


  exits: {
    serverError:{
      description:"send server error",
      responseType:"serverError"
    },
    ok:{
        description:"Send ok response",
        responseType:"ok"
    }
  },


  fn: async function (inputs, exits) {
    sails.log('calling action user/queue-status');
    try{
      let queue = await Rfp_queue.findOne({id: inputs.id});
      if(!queue){
        return exits.ok({
          status: false,
          message: sails.config.strings[inputs.user.language].INVALID_ID,
          data: []
        })               
      }
      const statuses = await sails.helpers.getAllStatuses();
      let query = `
      SELECT rfp_store.store_id,rfp.subcategory_id
      FROM request_for_proposals rfp
      INNER JOIN request_for_proposal_store rfp_store
        ON rfp_store.rfp_id = rfp.id
    
      WHERE rfp.id = ${queue.rfp_id}
      AND rfp.user_id = ${inputs.user.id}
      AND rfp.status_id NOT IN(${statuses.cancelled},${statuses.rejected},${statuses.deleted},${statuses.closed})
      AND rfp_store.status_id IN (${statuses.pending})
      `
      sails.log(query);
      let result = await sails.sendNativeQuery(query);
      if(!result.rows.length){
        return exits.ok({
          status: false,
          message: sails.config.strings[inputs.user.language].NOT_FOUND,
          data: []
        })       
      }
      let store_ids = _.map(result.rows, 'store_id');
      const stores = await Store.find({
        where: {id: store_ids},
        select: ['id','business_name','lat','lng','image','category_id','delivery','pickup','vendor_id']
      });
      var all_stores = [];
      for(const store of stores){
        let vendor = await Vendor.findOne({id: store.vendor_id, status: true});
        if(!vendor){
          continue;
        }
        let lat2 = store.lat;
        let lng2 =  store.lng;
    
      // var distance = parseFloat((await sails.helpers.getDistance({lat: lat1,lng: lng1},{lat: lat2, lng: lng2})).toFixed(2));  
        
         var subcategories = await Store_subcategory.find({
            where: {store_id: store.id},
            select:['subcategory_id']
          });
          // if(subcategories){
          //   subcategories.map(function (obj) { 
          //     if(!category_ids.includes(obj.subcategory_id)){
          //       category_ids.push(obj.subcategory_id)
          //     }
          //    });
           
          // }
        
          store.category_id = result.rows[0].subcategory_id;
          store.average_rating = await Store_review_rating.avg('rating').where({store_id: store.id});
          store.average_rating = parseFloat(store.average_rating.toFixed(2));
          let products = await sails.helpers.getStoreProducts(store.id);
          store.has_menu = products.length > 0 ? true:false;
          all_stores.push(store);                   
               
      }//end for
      if(all_stores.length){
        all_stores = all_stores.sort((a,b) => (a.distance > b.distance) ? 1 : ((b.distance > a.distance) ? -1 : 0)); 
        //all_stores = _.orderBy(all_stores, ['distance'],['asc']);
         sails.log(`${all_stores.length} nearby stores found`);
        return exits.success({
          status: true,
          message: sails.config.strings[inputs.user.language].STORES_FOUND.replace('{total}',all_stores.length),
          data:{stores: all_stores}
        });     
       }
    }catch(err){
      sails.log.error(`Error in getting queue status for id ${inputs.id}. ${err}`);
      return exits.ok({
        status: false,
        message: sails.config.strings[inputs.user.language].INVALID_ID,
        data: []
      })
    }

  }


};
