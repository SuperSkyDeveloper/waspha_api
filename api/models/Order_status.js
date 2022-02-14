/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore:'default',
  tableName: 'order_statuses',
  primaryKey: 'id',

  attributes: {
       
    id: {
      type: 'number',      
      autoIncrement:true
    },   
    proposal_id: {
      model: 'proposal',      
    },  
    order_placed: {
      type: 'ref',
      columnType: 'datetime',
      required: false
    },
    proposal_sent: {
      type: 'ref',
      columnType: 'datetime',
      required: false
    },
    order_accepted: {
      type: 'ref',
      columnType: 'datetime',
      required: false
    },
    order_prepared: {
      type: 'ref',
      columnType: 'datetime',
      required: false
    },
    order_picked: {
      type: 'ref',
      columnType: 'datetime',
      required: false
    },
    order_delivered: {
      type: 'ref',
      columnType: 'datetime',
      required: false
    },

  },
  

};

