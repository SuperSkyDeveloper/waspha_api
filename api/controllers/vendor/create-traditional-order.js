module.exports = {
  friendlyName: "Create traditional order",

  description: "",

  inputs: {
    vendor: {
      type: "ref",
      required: true,
      description: "logged in vendor",
    },
    package_charges: {
      type: "number",
      required: true,
    },

    pickup_location: {
      type: "ref",
      required: true,
    },
    delivery_location: {
      type: "ref",
      required: true,
    },
    items: {
      type: "json",
      required: true,
    },
  },

  exits: {
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("action vendor/create-traditional-order started");
    try {
      const statuses = await sails.helpers.getAllStatuses();
      const delvery_modes = await sails.helpers.getDeliveryModes();
      let items = inputs.items;
      let rec = {};
      rec.order_type = global.ORDER_TYPE.TRADITIONAL;
      rec.store_id = inputs.vendor.store.id;
      rec.package_charges = inputs.package_charges;
      rec.pickup_location = JSON.stringify(inputs.pickup_location);
      rec.delivery_location = JSON.stringify(inputs.delivery_location);
      rec.status_id = statuses[global.STATUS.ACCEPTED];
      rec.payment_method = global.PAYMENT_METHOD.CASH_ON_DELIVERY;
      rec.delivery_mode_id = delvery_modes[global.DRIVERY_MODE.WASPHA_EXPRESS];
      let order = await Proposal.create(rec).fetch();
      if (order) {
        for (item of items) {
          item.proposal_id = order.id;
          item.requirements = item.description;
          delete item.description;
        }
        await Proposal_item.createEach(items);
        let order_status = {
          proposal_id: order.id,
          order_placed: order.createdAt,
          proposal_sent: order.createdAt,
        };
        await Order_status.updateOrCreate(
          { proposal_id: order.id },
          order_status
        );
        delivery_vehicles = await sails.helpers.getWasphaDriverVehicles(
          order.id
        );
        let result = await sails.helpers.getDistanceMatrix(
          inputs.pickup_location,
          inputs.delivery_location
        );

        let data = { order_id: order.id, delivery_vehicles: delivery_vehicles };
        data.delviery_fee = await sails.helpers.getProposalEstimateDeliveryFee(
          order.id
        );

        for (vehicle of delivery_vehicles) {
          vehicle.price = await sails.helpers.getProposalEstimateDeliveryFee(
            order.id,
            vehicle.id
          );
          vehicle.eta = parseInt(result.duration.value / 60);
          switch (vehicle.id) {
            case 2: {
              vehicle.eta = parseInt(vehicle.eta / 2);
              break;
            }
            case 3: {
              vehicle.eta = parseInt(vehicle.eta / 1.5);
              break;
            }
            case 4: {
              vehicle.eta = parseInt(vehicle.eta * 2);
              break;
            }
            case 5: {
              vehicle.eta = parseInt(vehicle.eta * 3);
              break;
            }
          }
        }
        sails.log("action vendor/create-traditional-order ended");
        return exits.success({
          status: true,
          message: "",
          data: data,
        });
      }
      return exits.ok({
        status: false,
        message: "Unable to create",
      });
    } catch (err) {
      sails.log.error(
        `Error in action vendor/create-traditional-order. ${err}`
      );
      return exits.ok({
        status: false,
        message: "Unable to create",
      });
    }
  },
};
