/**
 * Vendor_message.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  datastore:'default',
  tableName: 'vendor_messages',
  primaryKey: 'id',

  attributes: {
    
    id: {
      type: 'number',      
      autoIncrement:true
    },   
    vendor_id: {
      model: 'vendor'
    },
    message: {
      type: 'string',
      required: true,
      columnType: 'text'
    },    
    deletedAt: {
      type: 'ref',
      columnType: 'datetime',
      required: false
    }
  },

};

