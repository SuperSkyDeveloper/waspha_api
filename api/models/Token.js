/**
 * Token.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  datastore:'default',
  tableName: 'tokens',  
  attributes: {   
    
    user_id: {
      type: 'number',
      required: true
      },
    token: {
      type: 'string',
      required: true,
      columnType: 'text'    
      },

  },

};

