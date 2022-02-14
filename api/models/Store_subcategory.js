/**
 * Store_subcategory.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore:'default',
  tableName: 'store_subcategory',
  primaryKey: 'id',
  attributes: {
    id: {
      type: 'number',      
      autoIncrement:true
      },   
    store_id: {
      model: 'store'
      },  
    subcategory_id: {
      model: 'category'
      },  

  },

};

