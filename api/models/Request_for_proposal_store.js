/**
 * Request_for_proposal_store.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  datastore:'default',
  tableName: 'request_for_proposal_store',
  primaryKey: 'id',

  attributes: {
    id: {
      type: 'number',      
      autoIncrement:true
      },   
      rfp_id: {
      model: 'request_for_proposal'
      },   
      store_id: {
      model: 'store'
      },   
      status_id: {
      model: 'status'
      },   
      is_read: {
      type: 'boolean',
      defaultsTo: false
      },   
      is_specific: {
      type: 'boolean',
      defaultsTo: false
      },   
      
  }
};
