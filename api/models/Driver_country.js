/**
 * Driver_country.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  datastore:'default',
  tableName: 'driver_country',
  primaryKey: 'id',

  attributes: {      
    driver_id: {
      model: 'driver',            
    },   
    country_id: {
      model: 'country',            
    },   
   
  },
};

