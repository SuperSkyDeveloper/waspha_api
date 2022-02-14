/**
 * Contact_us.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  datastore:'default',
  tableName: 'contact_us',
  primaryKey: 'id',

  attributes: {
    
    id: {
      type: 'number',      
      autoIncrement:true
    },   
    user_id: {
      type: 'number',
      required: true      
    },   
    user_role: {
      type: 'string',
      required: true,
      isIn: ['user','driver','vendor']      
    },   
    subject: {
      type: 'string',      
      required: true
    },   
    message: {
      type: 'string',     
      columnType: 'text', 
      required: true
    },   

}
}

