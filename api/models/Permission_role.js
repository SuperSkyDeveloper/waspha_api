/**
 * Permission_role.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  datastore:'default',
  tableName: 'permission_role',
  primaryKey: 'id',

  attributes: { 
    id: {
      type: 'number',      
      autoIncrement:true
    },   
    role_id: {
      model:'role'
    },
    permission_id: {
      model: 'permission'
    }
  },

};

