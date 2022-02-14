/**
 * Store_timing.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore:'default',
  tableName: 'store_timings',
  
  attributes: {    
    store_id: {
      model: 'store'
    },   
    day: {
      type: 'string',
      required: true      
    },
    from: {
      type: 'ref',
      columnType: 'datetime',
      required: false      
      },
    to: {
      type: 'ref',
      columnType: 'datetime',
      required: false      
      },
    deletedAt: {
      type: 'ref',
      columnType: 'datetime',
      required: false
      }

  },

};

