module.exports = {
  friendlyName: "Get order status",

  description: "",

  inputs: {
    proposal_id: {
      type: "number",
      required: true,
    },
    type: {
      type: "string",
      required: false,
      allowNull: true,
    },
    language: {
      type: "string",
      required: false,
      allowNull: true,
    },
  },

  exits: {
    success: {
      outputFriendlyName: "Order status",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper get-order-status");
    try {
      let titles = {
        1: {
          en: "Order Placed",
          ar: "تم الطلب",
        },
        2: {
          en: "Proposal Sent",
          ar: "تم الطلب",
        },
        3: {
          en: "Order Accepted",
          ar: "تم الطلب",
        },
        4: {
          en: "Order Picked",
          ar: "تم الطلب",
        },
        5: {
          en: "Order Delivered",
          ar: "تم الطلب",
        },
        6: {
          en: "Order Prepared",
          ar: "تم الطلب",
        },
        7: {
          en: "Rider Assigned",
          ar: "تم الطلب",
        },
      };
      const os = await Order_status.findOne({
        proposal_id: inputs.proposal_id,
      });
      var order_flow = [];
      order_placed = {
        id: 1,
        title: titles[1][inputs.language],
        date: "2020-09-14T20:00:00.000Z",
        status: true,
      };
      proposal_sent = {
        id: 2,
        title: titles[2][inputs.language],
        date: "2020-09-14T20:00:00.000Z",
        status: true,
      };
      order_accepted = {
        id: 3,
        title: titles[3][inputs.language],
        date: "2020-09-14T20:00:00.000Z",
        status: true,
      };
      order_picked = {
        id: 4,
        title: titles[4][inputs.language],
        date: "2020-09-14T20:00:00.000Z",
        status: true,
      };
      order_delivered = {
        id: 5,
        title: titles[5][inputs.language],
        date: "2020-09-14T20:00:00.000Z",
        status: true,
      };

      if (os) {
        order_placed = {
          id: 1,
          title: titles[1][inputs.language],
          date: os.order_placed,
          status: os.order_placed != null ? true : false,
        };
        proposal_sent = {
          id: 2,
          title: titles[2][inputs.language],
          date: os.proposal_sent,
          status: os.proposal_sent != null ? true : false,
        };
        order_accepted = {
          id: 3,
          title: titles[3][inputs.language],
          date: os.order_accepted,
          status: os.order_accepted != null ? true : false,
        };
        order_picked = {
          id: 4,
          title: titles[4][inputs.language],
          date: os.order_picked,
          status: os.order_picked != null ? true : false,
        };
        order_prepared = {
          id: 6,
          title: titles[6][inputs.language],
          date: os.order_prepared,
          status: os.order_prepared != null ? true : false,
        };
        order_delivered = {
          id: 5,
          title: titles[5][inputs.language],
          date: os.order_delivered,
          status: os.order_delivered != null ? true : false,
        };
      }
      let driver_type = await sails.helpers.getProposalDriverType(
        inputs.proposal_id
      );
      if (driver_type == global.DRIVER_TYPE.OFFLINE) {
        order_picked.title = titles[7][inputs.language];
      }

      order_flow.push(order_placed);
      order_flow.push(proposal_sent);
      order_flow.push(order_accepted);

      if (
        !_.isUndefined(inputs.type) &&
        inputs.type == global.RFP_TYPE.DELIVERY
      ) {
        order_flow.push(order_picked);
        order_flow.push(order_delivered);
      } else {
        order_flow.push(order_prepared);
        order_flow.push(order_picked);
      }

      return exits.success(order_flow);
    } catch (err) {
      sails.log.error(
        `Error getting order status for proposal id ${inputs.proposal_id}. Error: ${err}`
      );
      return exits.success([]);
    }
  },
};
