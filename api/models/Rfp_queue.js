/**
 * Rfp_queue.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const moment = require('moment');
module.exports = {
  datastore:'default',
  tableName: 'rfp_queue',
  primaryKey: 'id',

  attributes: {
    rfp_id: {
      model: 'request_for_proposal'
    },
    last_run_at: {
      type: 'ref',
      columnType: 'datetime',
      required: false
    },
    last_step: {
      type: 'number',
      required: true
    },
    last_radius: {
      type: 'number',
      required: true
    },
    // createdAt: {
    //   type: 'ref',
    //   columnType: 'datetime',
    //   defaultsTo: moment.utc().format("YYYY-MM-DD HH:mm:ss")
    // },
    // updatedAt: {
    //   type: 'ref',
    //   columnType: 'datetime',
    //   defaultsTo: moment.utc().format("YYYY-MM-DD HH:mm:ss")
    // },
  },

};

