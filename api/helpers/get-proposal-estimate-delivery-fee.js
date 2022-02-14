module.exports = {
  friendlyName: "Get proposal estimate delivery fee",

  description: "",

  inputs: {
    proposal_id: {
      type: "number",
      required: true,
    },
    delivery_vehicle_id: {
      type: "number",
      required: false,
    },
  },

  exits: {
    success: {
      outputFriendlyName: "Proposal estimate delivery fee",
    },
  },

  fn: async function (inputs, exits) {
    try {
      let proposal = await Proposal.findOne({
        id: inputs.proposal_id,
      }).populate("store_id");
      let delivery_vehicle_id = proposal.delivery_vehicle_id;
      if (!_.isUndefined(inputs.delivery_vehicle_id)) {
        delivery_vehicle_id = inputs.delivery_vehicle_id;
      }
      let store = proposal.store_id;
      let pickup_location = null;
      let delivery_location = null;
      if (proposal.order_type == global.ORDER_TYPE.TRADITIONAL) {
        pickup_location = JSON.parse(proposal.pickup_location);
        delivery_location = JSON.parse(proposal.delivery_location);
      } else {
        let rfp_store = await Request_for_proposal_store.findOne({
          id: proposal.rfp_store_id,
        })
          .populate("store_id")
          .populate("rfp_id");
        store = rfp_store.store_id;
        rfp = rfp_store.rfp_id;
        pickup_location = {
          address: store.address,
          lat: store.lat,
          lng: store.lng,
        };
        delivery_location = {
          address: rfp.address,
          lat: rfp.lat,
          lng: rfp.lng,
        };
      }
      let result = await sails.helpers.getDistanceMatrix(
        pickup_location,
        delivery_location
      );

      let charges = await sails.helpers.general.getDeliveryVehicleCharges(
        store.vendor_id,
        global.ROLE.VENDOR
      );
      let vehicle_fee_obj = null;
      if (delivery_vehicle_id) {
        vehicle_fee_obj = _.find(charges, {
          delivery_vehicle: delivery_vehicle_id,
        });
      }
      if (!vehicle_fee_obj) {
        vehicle_fee_obj = {
          base_fee: 5,
          fee_per_km: 1,
          fee_per_minute: 1.5,
        };
      }
      let delivery_base_fee = vehicle_fee_obj.base_fee; //will be set from admin panel
      let fee_per_minute = vehicle_fee_obj.fee_per_minute; //will be set from admin panel
      let fee_per_km = vehicle_fee_obj.fee_per_km; //will be set from admin panel

      let total_minutes = result.duration.value / 60;
      let total_km = result.distance.value / 1000;
      estimate_delivery_fee =
        delivery_base_fee +
        total_minutes * fee_per_minute +
        total_km * fee_per_km;
      estimate_delivery_fee = await sails.helpers.fixDoubleValue(
        estimate_delivery_fee
      );
      sails.log({
        eta: result.duration.value / 60,
        km: result.distance.value / 1000,
      });
      if (!proposal.delivery_fee) {
        await Proposal.updateOne({ id: proposal.id }).set({
          delivery_fee: estimate_delivery_fee,
        });
      }
      sails.log({ result });
      return exits.success(estimate_delivery_fee);
    } catch (err) {
      sails.log(`Error in helper get-proposal-estimate-delivery-fee. ${err}`);
      return exits.success(null);
    }
  },
};
