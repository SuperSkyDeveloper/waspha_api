/**
 * Store_review_rating.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  datastore:'default',
  tableName: 'driver_reviews_ratings',
  primaryKey: 'id',

  attributes: {
    
    id: {
      type: 'number',      
      autoIncrement:true
    },
    order_id: {
      model: 'proposal'      
    },   
    driver_id: {
      model: 'driver'      
    },
    user_id: {
      model: 'user'      
      },
      store_id: {
        model: 'store'      
        },
    review: {
      type: 'string',
      columnType: 'text',
      required: false,
      allowNull: true
      },
    rating: {
      type: 'number',      
      required: true,
      min: 1,
      max: 5
      },
    deletedAt: {
      type: 'ref',
      columnType: 'datetime',
      required: false
    }

  },

};

