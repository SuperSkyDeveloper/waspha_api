/**
 * Proposal_driver_reason.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "proposal_driver_reasons",

  attributes: {
    proposal_driver_id: {
      model: "proposal_driver",
    },
    reasons: {
      type: "string",
      columnType: "text",
      required: true,
    },
    description: {
      type: "string",
      columnType: "text",
      required: false,
      allowNull: true,
    },
  },
};
