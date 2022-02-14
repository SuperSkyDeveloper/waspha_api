/**
 * User_country.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  datastore:'default',
  tableName: 'user_country',
  primaryKey: 'id',

  attributes: {      
    user_id: {
      model: 'user',            
    },   
    country_id: {
      model: 'country',            
    },   
   
  },

};

