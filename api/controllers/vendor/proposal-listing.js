function pluck(array, key) {
  return array.map((o) => o[key]);
}

module.exports = {
  friendlyName: "Proposal listing",

  description: "",

  inputs: {
    vendor: {
      type: "ref",
      required: true,
      description: "logged in vendor",
    },
    status: {
      type: "string",
      required: false,
      isIn: ["pending", "accepted", "assigned", "completed", "cancelled"],
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
    sails.log("calling action vendor/proposal-listing");

    const strings = sails.config.strings[inputs.vendor.language];
    try {
      var statuses = await sails.helpers.getAllStatuses();

      let query = `
        SELECT DISTINCT(p.id) AS proposal_id,p.order_type,p.is_delivery_mode_changed, u.id as user_id, u.name as user_name, u.avatar as user_avatar,u.rc_id,u.rc_username ,p.createdAt as order_date,p.is_revised,p.revision_number,p.proposal_selection_time,rfp_store.id as rfp_store_id,rfp_store.status_id,
        rfp.id as rfp_id,rfp.createdAt as rfp_created_at,rfp.delivery_location,s.slug as status,p.type,p.delivery_vehicle_id,p.delivery_mode_id,
        os.order_picked,pd.createdAt
        FROM users u
        INNER JOIN request_for_proposals rfp 
          ON u.id = rfp.user_id        
        INNER JOIN request_for_proposal_store rfp_store 
          ON rfp.id = rfp_store.rfp_id        
        INNER JOIN proposals p 
          ON rfp_store.id = p.rfp_store_id
        LEFT JOIN proposal_driver pd 
          ON pd.proposal_id = p.id    
        INNER JOIN statuses s 
          ON p.status_id = s.id
        LEFT JOIN order_statuses os 
          ON os.proposal_id = p.id            
        WHERE p.order_type = '${global.ORDER_TYPE.NORMAL}'  
         AND rfp_store.store_id = ${inputs.vendor.store.id}           
        `;

      let query2 = `
        SELECT DISTINCT(p.id) AS proposal_id,p.order_type, p.is_delivery_mode_changed,NULL AS user_id, NULL AS user_name, NULL AS user_avatar, NULL AS rc_id,NULL AS rc_username ,
        p.createdAt AS order_date,p.is_revised,p.revision_number,p.proposal_selection_time,NULL AS rfp_store_id,NULL AS status_id,
        NULL AS rfp_id,NULL AS rfp_created_at,p.delivery_location AS delivery_location,s.slug AS status,p.type,p.delivery_vehicle_id,p.delivery_mode_id,
        os.order_picked,pd.createdAt
        FROM proposals p

        LEFT JOIN proposal_driver pd
          ON pd.proposal_id = p.id
        INNER JOIN statuses s
          ON p.status_id = s.id
        LEFT JOIN order_statuses os
          ON os.proposal_id = p.id 
        WHERE p.order_type = '${global.ORDER_TYPE.TRADITIONAL}'  
        AND p.store_id = ${inputs.vendor.store.id}`;
      if (inputs.status) {
        if (inputs.status === sails.config.globals.status.assigned) {
          query += ` AND p.status_id IN (${statuses.assigned},${statuses.assigned_online},${statuses.assigned_offline},${statuses.assigned_waspha})`;
          query2 += ` AND p.status_id IN (${statuses.assigned},${statuses.assigned_online},${statuses.assigned_offline},${statuses.assigned_waspha})`;
        } else {
          if (inputs.status === global.STATUS.ACCEPTED) {
            query += ` AND p.status_id IN (${statuses[inputs.status]}, ${
              (statuses[global.STATUS.PREPARED],
              statuses[global.STATUS.USER_APPROVAL_PENDING])
            })`;
          } else if (inputs.status === global.STATUS.CANCELLED) {
            query += ` AND p.status_id IN (${statuses[inputs.status]}, ${
              statuses[global.STATUS.REJECTED]
            }, ${statuses[global.STATUS.EXPIRED]})`;
            query2 += ` AND p.status_id IN (${statuses[inputs.status]}, ${
              statuses[global.STATUS.REJECTED]
            }, ${statuses[global.STATUS.EXPIRED]})`;
          } else {
            query += ` AND p.status_id IN (${statuses[inputs.status]})`;
            query2 += ` AND p.status_id IN (${statuses[inputs.status]})`;
          }

          //  query += ` ORDER BY p.createdAt DESC`;
        }
        if (inputs.status === global.STATUS.PENDING) {
          //query += ` AND rfp_store.is_read = 0`;
        }
      } else {
      }
      query += ` ORDER BY p.createdAt DESC`;
      query2 += ` ORDER BY p.createdAt DESC`;
      sails.log(query);
      sails.log(query2);
      var orders = await sails.sendNativeQuery(query);
      var merged_result = [];
      if (orders.rows.length) {
        merged_result = orders.rows;
      }
      if (inputs.status !== global.STATUS.ACCEPTED) {
        var traditional_orders = await sails.sendNativeQuery(query2);
        if (traditional_orders.rows.length) {
          traditional_orders = traditional_orders.rows;

          merged_result = _.union(merged_result, traditional_orders);
          merged_result = _.sortByOrder(
            merged_result,
            ["proposal_id"],
            ["desc"]
          );
        }
      }
      if (merged_result.length) {
        sails.log(`${merged_result.length} orders found`);
        var all_orders = [];
        for (order of merged_result) {
          //  console.log("order:",order);
          var temp = {};
          temp["id"] = order.proposal_id;
          temp["order_type"] = order.order_type;
          temp["is_delivery_mode_changed"] = Boolean(
            order.is_delivery_mode_changed
          );

          temp["request_code"] = order.rfp_id;
          temp["order_date"] = order.rfp_created_at || order.order_date;
          if (order.status == global.STATUS.PENDING) {
            temp["proposal_selection_time"] = order.proposal_selection_time;
          }

          temp["is_revised"] = order.is_revised == 1 ? true : false;
          temp["revision_number"] = order.revision_number;
          temp["description"] = await sails.helpers.getProposalDescription(
            order,
            inputs.vendor.language
          );

          temp["status"] = order.status;
          temp["type"] = order.type;

          if (inputs.status == global.STATUS.ASSIGNED) {
            temp["picked"] = order.order_picked != null ? true : false;
          }

          temp["delivery_mode_id"] = order.delivery_mode_id;
          temp["delivery_vehicle_id"] = order.delivery_vehicle_id;

          var user = {};
          user["id"] = order.user_id;
          user["name"] = order.user_name;
          user["avatar"] = order.user_avatar;
          user["rc_id"] = order.rc_id;
          user["rc_username"] = order.rc_username;
          temp["user"] = user;

          includes = _.find(all_orders, temp);

          // sails.log({ includes: includes });
          // sails.log({ all_orders: all_orders });
          if (!includes) {
            all_orders.push(temp);
          }
          // if (!_.includes(all_orders, temp)) {
          //   all_orders.push(temp);
          // }
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
        `Error fetching orders for store id ${inputs.vendor.store.id}. Error: ${err}`
      );
      return exits.ok({
        status: false,
        message: strings.NOT_FOUND,
        data: [],
      });
    }
  },
};
