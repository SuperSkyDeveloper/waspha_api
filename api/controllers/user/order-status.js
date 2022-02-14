const googleDistanceMatrix = require("google-distance-matrix");

module.exports = {
  friendlyName: "Order status",

  description: "",

  inputs: {
    user: {
      type: "ref",
      required: true,
      description: "logged in user",
    },
    id: {
      type: "number",
      required: true,
    },
  },

  exits: {
    serverError: {
      description: "send server error",
      responseType: "serverError",
    },
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action user/order-status");
    try {
      let data = {};
      data["id"] = inputs.id;
      let attr = await sails.helpers.getProposalAttributes(inputs.id);
      if (!attr.type) {
        return exits.ok({
          status: false,
          message: sails.config.strings[inputs.user.language].NOT_FOUND,
          data: [],
        });
      }
      data["status"] = attr.status;
      data["type"] = attr.type;
      data["order_flow"] = await sails.helpers.getOrderStatus(
        inputs.id,
        data["type"],
        inputs.user.language
      );
      data["driver"] = null;
      if (data["type"] == global.RFP_TYPE.DELIVERY) {
        data["driver"] = await sails.helpers.getProposalDriver(
          inputs.id,
          inputs.user.language
        );
        if (!_.isEmpty(data["driver"])) {
          data["driver"].task_eta = await sails.helpers.getEta(inputs.id);
        }
      }
      let vendor = await sails.helpers.getVendorOfOrder(inputs.id, "proposal");
      var subcategories = await Store_subcategory.find({
        where: { store_id: vendor.s_id },
        select: ["subcategory_id"],
      })
        .limit(1)
        .sort("id ASC");
      data.vendor = {
        id: vendor.id,
        store: {
          id: vendor.s_id,
          owner: vendor.owner,
          name: vendor.business_name,
          image: vendor.image,
          category_id: subcategories[0].subcategory_id || null,
          rc_id: vendor.rc_id,
          rc_username: vendor.rc_username,
          contact: {
            country_code: vendor.s_country_code,
            number: vendor.s_phone,
          },
          location: {
            lat: vendor.lat,
            lng: vendor.lng,
          },
        },
      };
      return exits.success({
        status: true,
        message: "",
        data: data,
      });
    } catch (err) {
      sails.log.error(
        `Error in getting order status for id ${inputs.id}. ${err}`
      );
      return exits.ok({
        status: false,
        message: "",
        data: [],
      });
    }
  },
};
