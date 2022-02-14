/**
 * Proposal_revised_item.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore:'default',
  tableName: 'proposal_revised_items',
  primaryKey: 'id',

  attributes: {
     
    proposal_item_id: {
      model: 'proposal_item'
      },  
    quantity: {
      type: 'number',
      required: true,  
      min: 0  
    },
    remarks: {
      type: 'string',
      required: false,
      allowNull: true
    },
    remarks_image: {
      type: 'string',
      required: false,
      allowNull: true
    },
  },

};

