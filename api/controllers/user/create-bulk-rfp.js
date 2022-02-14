const moment = require( 'moment' );

module.exports = {


  friendlyName: 'Create rfp',


  description: '',


  inputs: {
    user: {
      type: 'ref',
      required: true,
      description: 'logged in user'
    },
    store_id: {
      type: 'number',
      required: false            
    }, 
    subcategory_id: {
      type: 'number',
      required: true            
    }, 
    delivery_location: {
      type: 'json',     
      required:true ,
      custom: function(value){
        return _.isObject(value) 
        && typeof value.address !== 'undefined' 
        && typeof value.lat !== 'undefined' 
        && typeof value.lng !== 'undefined'
        && _.isString(value.address) 
        && _.isNumber(value.lat) 
        && _.isNumber(value.lng); 
      }     
    },   
    delivery_mode_id:{
     type: 'number',
     required: false,
     defaultsTo: 1
    } ,
    landmark: {
      type: 'string',     
      required:false       
      }, 
      scheduled_delivery_time: {
      type: 'string',     
      required:false       
      }, 
    items: {   
      type:'json',      
      required:true ,
      custom: function(value){
        for(i of value){
          var flag = _.isObject(i) 
          && typeof i.name !== 'undefined' 
          && typeof i.quantity !== 'undefined' 
          && typeof i.requirements !== 'undefined'
          && typeof i.image !== 'undefined'
          && _.isString(i.name) 
          && _.isNumber(i.quantity) 
          && _.isString(i.requirements)
          && _.isString(i.image);
          if(flag == false){
            return flag;
          }
        }
        return true
      
      }        
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

    sails.log("calling action user/create-rfp");
    
    try{
    
        let user = inputs.user;
        let subcategory_id = inputs.subcategory_id;
        let delivery_location = inputs.delivery_location;        
        let items = inputs.items;

        if(inputs.store_id){
         var store = await Store.findOne({id: inputs.store_id});
         if(!store){
          return exits.ok({
            status: false,
            message: "Invalid store id",
            data: []            
          })
         }
        }

        const subcategoryExist = await sails.helpers.categoryExist.with({id:  subcategory_id});
        if(!subcategoryExist)
        {
          return exits.ok({
            status: false,
            data: [],
            message: "Invalid subcategory id"
          })
        }
        const rec = {
          user_id: user.id,
          subcategory_id: subcategory_id,
          delivery_location: delivery_location.address,
          lat: delivery_location.lat,
          lng: delivery_location.lng,
          delivery_mode_id: inputs.delivery_mode_id
        };
        if(inputs.landmark)
        {
          rec["landmark"] = inputs.landmark;
        }
        if(inputs.scheduled_delivery_time)
        {
          rec["scheduled_delivery_time"] = moment(inputs.scheduled_delivery_time).format("YYYY-MM-DD HH:mm:ss")
        }
        const statuses = await sails.helpers.getAllStatuses();
        
        
        var rfp =  await sails.models.request_for_proposal.create(rec).fetch();
        
        if(rfp.id)
        {
          sails.log(`RFP created with id '${rfp.id}'`)     
            
          sails.log(`Attaching items for RFP with id '${rfp.id}'`);

          for (const item of items) {
                     
            item.rfp_id = rfp.id;
            if(item.image)
            {            
              item.image  = await sails.helpers.aws.uploadFile(item.image,'rfp-items');              
            }    
            if(item.product_id){
                /// check for valid product id    
            }
            await Request_for_proposal_item.create(item);   
          
          }

          if(inputs.store_id)
          {
            sails.log(`Store id ${inputs.store_id} is provided, associating rfp to store`);
            //await sails.models.request_for_proposal.addToCollection(rfp.id, 'stores', inputs.store_id);
            await sails.models.request_for_proposal_store.create({
              rfp_id: rfp.id,
              store_id: inputs.store_id,
              status_id: statuses.pending
            })
          }
                
          return exits.success({
            status: true,
            data: rfp,
            message: 'RFP created successfully'
          });
        }        
    }
    catch(err){
      sails.log.error(`Error in creating RFP: ${err}`)
      return exits.serverError({
        status: false,
        message: "Unable to create RFP, Please try again"
      })
    }

  }


};
