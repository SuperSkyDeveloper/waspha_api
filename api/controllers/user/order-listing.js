function pluck(array, key) {
  return array.map((o) => o[key]);
}

module.exports = {
  friendlyName: "Order listing",

  description: "",

  inputs: {
    user: {
      type: "ref",
      required: true,
      description: "logged in user",
    },
    status: {
      type: "json",
      required: false,
      //isIn: ['pending','accepted','assigned','completed','cancelled']
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
    sails.log("calling action user/order-listing");
    const strings = sails.config.strings[inputs.user.language];
    try {
      var statuses = await sails.helpers.getAllStatuses();

      let query = `
        SELECT u.id as user_id, u.name as user_name, u.avatar as user_avatar ,p.createdAt as order_date,rfp_store.id as rfp_store_id,rfp_store.status_id,
        rfp.id as rfp_id,rfp.createdAt as rfp_created_at,rfp.delivery_location,s.slug as status,p.id AS proposal_id,p.type,p.createdAt AS proposal_date,
        p.is_delivery_mode_changed,p.delivery_mode_id,p.payment_method,p.delivery_fee,p.old_delivery_fee,os.order_picked,
        dv.image as vehicle_image,dv.color_image as vehicle_color_image, st.business_name as store_name,st.image as store_image
        FROM users u
        INNER JOIN request_for_proposals rfp on u.id = rfp.user_id
        INNER JOIN request_for_proposal_store rfp_store on rfp.id = rfp_store.rfp_id
        INNER JOIN stores st ON rfp_store.store_id = st.id
        INNER JOIN proposals p ON rfp_store.id = p.rfp_store_id  
        INNER JOIN statuses s ON p.status_id = s.id          
        LEFT JOIN order_statuses os ON os.proposal_id = p.id    
        LEFT JOIN delivery_vehicles dv on dv.id = p.delivery_vehicle_id
        WHERE rfp.user_id = ${inputs.user.id}           
        `;

      if (inputs.status) {
        //query += ` AND p.status_id = ${statuses[inputs.status]}`
        if (inputs.status.includes(global.STATUS.ACCEPTED)) {
          inputs.status.push(global.STATUS.PREPARED);
        }
        query += ` AND s.slug IN ('${inputs.status.join("','")}')`;
      } else {
        query += ` AND p.status_id = ${statuses["accepted"]},${statuses["prepared"]}`;
      }
      query += ` ORDER BY p.createdAt DESC`;
      console.log(query);
      var orders = await sails.sendNativeQuery(query);

      if (orders.rows.length) {
        var all_orders = [];

        for (order of orders.rows) {
          var temp = {};
          temp["id"] = order.proposal_id;
          temp["rfp_id"] = order.rfp_id;
          temp["type"] = order.type;
          temp["payment_method"] = order.payment_method;
          temp["old_delivery_fee"] = order.old_delivery_fee;
          temp["new_delivery_fee"] = order.delivery_fee;
          temp["delivery_mode_id"] = order.delivery_mode_id;
          temp["is_delivery_mode_changed"] = Boolean(
            order.is_delivery_mode_changed
          );
          temp["order_date"] = order.proposal_date;
          temp["description"] = await sails.helpers.getProposalDescription(
            order,
            inputs.user.language
          );

          temp["status"] = order.status;
          temp["type"] = order.type;

          if (inputs.status == global.STATUS.ASSIGNED) {
            temp["picked"] = order.order_picked != null ? true : false;
          }

          var store = {};
          store.name = order.store_name;
          store.image = order.store_image;
          temp["store"] = store;
          var vehicle = {};
          vehicle.image = {
            white: order.vehicle_image,
            color: order.vehicle_color_image,
          };
          temp["vehicle"] = vehicle;

          var user = {};
          user["id"] = order.user_id;
          user["name"] = order.user_name;
          user["avatar"] = order.user_avatar;
          temp["user"] = user;
          all_orders.push(temp);
        }
        return exits.success({
          status: true,
          message: strings.FOUND,
          data: all_orders,
        });
      }
      return exits.ok({
        status: true,
        message: strings.NOT_FOUND,
        data: [],
      });
    } catch (err) {
      sails.log.error(
        `Error fetching orders for user id ${inputs.user.id}. Error: ${err}`
      );
      return exits.ok({
        status: false,
        message: strings.NOT_FOUND,
        data: [],
      });
    }
  },
};
