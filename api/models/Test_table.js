/**
 * Test_table.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  datastore:'default',
  tableName: 'test_table',  
  attributes: {   
    address: {
      type: 'string',
      required: true
    },
    location: {
      type: 'json',
      columnType: 'point',
      required: true
      },
  

  },

};

