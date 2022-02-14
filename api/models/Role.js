/**
 * Role.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  datastore:'default',
  tableName: 'roles',
  primaryKey: 'id',

  attributes: { 
    id: {
      type: 'number',      
      autoIncrement:true
    },   
    name: {
      type: 'string',
      required: true,
      unique: true
    },
    display_name: {
      type: 'string',
      required: true,      
    },
    deletedAt: {
      type: 'ref',
      columnType: 'datetime',
      required: false
    },

  },

};

