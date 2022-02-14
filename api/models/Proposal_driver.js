/**
 * Proposal_driver.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: "default",
  tableName: "proposal_driver",
  primaryKey: "id",

  attributes: {
    id: {
      type: "number",
      autoIncrement: true,
    },
    proposal_id: {
      model: "proposal",
    },
    driver_id: {
      model: "driver",
    },
    code: {
      type: "number",
      required: false,
      allowNull: true,
    },
    penalty_fee: {
      type: "number",
      required: false,
      defaultsTo: 0,
    },
    status_id: {
      model: "status",
    },
  },
};
