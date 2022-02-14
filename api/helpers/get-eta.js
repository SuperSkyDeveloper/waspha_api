module.exports = {
  friendlyName: "Get eta",

  description: "",

  inputs: {
    proposal_id: {
      type: "number",
      required: true,
    },
  },

  exits: {
    success: {
      outputFriendlyName: "eta",
    },
  },

  fn: async function (inputs, exits) {
    let task_eta = null;
    try {
      let proposal = await Proposal.findOne({ id: inputs.proposal_id });
      let pickup_location = null;
      let delivery_location = null;
      if (proposal && proposal.order_type === global.ORDER_TYPE.TRADITIONAL) {
        pickup_location = JSON.parse(proposal.pickup_location);
        delivery_location = JSON.parse(proposal.delivery_location);
      } else {
        let rfp_store = await Request_for_proposal_store.findOne({
          id: proposal.rfp_store_id,
        })
          .populate("store_id")
          .populate("rfp_id");
        pickup_location = {
          lat: rfp_store.store_id.lat,
          lng: rfp_store.store_id.lng,
        };
        delivery_location = {
          lat: rfp_store.rfp_id.lat,
          lng: rfp_store.rfp_id.lng,
        };
      }
      task_eta = await sails.helpers.getDistanceMatrix(
        pickup_location,
        delivery_location
      );
    } catch (err) {
      sails.log.error(`Error in helper get-task-eta. ${err}`);
    }
    return exits.success(task_eta);
  },
};
