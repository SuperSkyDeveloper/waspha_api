module.exports = {
  friendlyName: "Earnings",

  description: "Earnings driver.",

  inputs: {
    driver: {
      type: "ref",
      required: true,
      description: "logged in driver",
    },
    filter: {
      type: "string",
      required: false,
      isIn: ["monthly", "weekly", "yearly"],
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
    sails.log("calling action driver/earnings");
    const statuses = await sails.helpers.getAllStatuses();
    try {
      var query = `
      SELECT  
        rfp_store.rfp_id AS rfp_id,p.id AS proposal_id,
        SUM(i.price*i.quantity +(i.price*i.tax_ratio/100)*i.quantity) AS total_amount ,p.createdAt AS order_date,
        p.type,p.delivery_fee,p.order_type, pd.id AS trip_id,pd.createdAt AS trip_date,u.id AS u_id,u.name AS user_name,u.avatar AS u_avatar,
        st.id AS s_id,st.business_name AS s_name,st.address AS s_address,
        st.lat AS s_lat, st.lng AS s_lng,rfp.delivery_location AS u_address,rfp.lat AS u_lat,
        rfp.lng AS u_lng,s.slug AS status
      FROM proposals p
      INNER JOIN 
        request_for_proposal_store rfp_store ON rfp_store.id = p.rfp_store_id
      INNER JOIN 
        request_for_proposals rfp ON rfp.id = rfp_store.rfp_id
      INNER JOIN 
        users u ON u.id = rfp.user_id
      INNER JOIN 
        proposal_items i ON i.proposal_id = p.id
      INNER JOIN 
        proposal_driver pd ON pd.proposal_id = p.id
      INNER JOIN 
        statuses s ON p.status_id = s.id
      INNER JOIN 
        statuses ds ON pd.status_id = ds.id
      INNER JOIN 
        stores st ON st.id = rfp_store.store_id
      WHERE 
        pd.driver_id = ${inputs.driver.id}
      AND         
        s.slug = '${global.STATUS.COMPLETED}' 
      AND 
        ds.id = ${statuses.payment_received}
      `;
      var to_query = ` 
      SELECT NULL AS rfp_id,p.id AS proposal_id,
      SUM(i.price*i.quantity +(i.price*i.tax_ratio/100)*i.quantity) AS total_amount ,p.createdAt AS order_date,
      p.type,p.delivery_fee,p.pickup_location,p.delivery_location,p.package_charges,p.order_type, pd.id AS trip_id,pd.createdAt AS trip_date,NULL AS u_id,NULL AS user_name,NULL AS u_avatar,
      st.id AS s_id,st.business_name AS s_name,st.address AS s_address,
      st.lat AS s_lat, st.lng AS s_lng,NULL AS u_address,NULL AS u_lat,
      NULL AS u_lng,s.slug AS status
      FROM proposals p    
      INNER JOIN 
        proposal_items i ON i.proposal_id = p.id
      INNER JOIN 
        proposal_driver pd ON pd.proposal_id = p.id
      INNER JOIN 
        statuses s ON p.status_id = s.id
      INNER JOIN 
        statuses ds ON pd.status_id = ds.id
      INNER JOIN 
        stores st ON st.id = p.store_id
      WHERE 
        pd.driver_id = ${inputs.driver.id}
      AND         
        s.slug = 'completed' 
      AND 
        ds.id = 14     
    `;
      if (!_.isUndefined(inputs.filter)) {
        switch (inputs.filter) {
          case "weekly": {
            query += `  AND p.createdAt BETWEEN DATE_SUB(NOW(),INTERVAL 1 WEEK) AND NOW()`;
            to_query += `  AND p.createdAt BETWEEN DATE_SUB(NOW(),INTERVAL 1 WEEK) AND NOW()`;
            break;
          }
          case "monthly": {
            query += `  AND p.createdAt BETWEEN DATE_SUB(NOW(),INTERVAL 1 MONTH) AND NOW()`;
            to_query += `  AND p.createdAt BETWEEN DATE_SUB(NOW(),INTERVAL 1 MONTH) AND NOW()`;
            break;
          }
          case "yearly": {
            //  query += `  AND YEAR(p.createdAt) = YEAR(CURDATE())`
            query += `  AND p.createdAt BETWEEN DATE_SUB(NOW(),INTERVAL 1 YEAR) AND NOW()`;
            to_query += `  AND p.createdAt BETWEEN DATE_SUB(NOW(),INTERVAL 1 YEAR) AND NOW()`;
            break;
          }
        }
      }
      query += ` 
    GROUP BY 
        p.id  ,pd.id
      ORDER BY 
        p.createdAt DESC
      LIMIT 20
      `;
      to_query += ` 
    GROUP BY 
        p.id  ,pd.id
      ORDER BY 
        p.createdAt DESC
      LIMIT 20
      `;
      //console.log(to_query);
      var result = await sails.sendNativeQuery(query);
      var merged_result = [];
      if (result.rows.length) {
        merged_result = result.rows;
      }
      result = await sails.sendNativeQuery(to_query);
      if (result.rows.length) {
        merged_result = _.union(merged_result, result.rows);
      }
      let total_penalty = await Proposal_driver.sum("penalty_fee").where({
        driver_id: inputs.driver.id,
      });
      let data = { total_earnings: 0, total_penalty: total_penalty };
      if (!merged_result.length) {
        return exits.ok({
          status: true,
          message: sails.config.strings[inputs.driver.language].NOT_FOUND,
          data: data,
        });
      }

      merged_result = _.sortByOrder(merged_result, ["proposal_id"], ["desc"]);
      let orders = [];
      let trips = [];
      let wasphaFee = 5;
      let setting = await sails.helpers.getSetting([
        "waspha_fee_delivery",
        "waspha_fee_delivery_type",
        "waspha_fee_pickup",
        "waspha_fee_pickup_type",
      ]);

      //let wasphaFeeAmount = 0;
      let total_amount = 0;
      for (obj of merged_result) {
        let credit_debit = await sails.helpers.driver.calculateCreditDebit(
          obj.proposal_id,
          inputs.driver.id
        );
        /////order
        var order = {};
        order.id = obj.proposal_id;
        order.order_type = obj.order_type;
        order.order_code = obj.rfp_id;
        //sails.log({ obj: obj });

        if (obj.delivery_location) {
          var store_location = obj.delivery_location;
        }
        obj.delivery_location = obj.s_address;
        order.order_details = await sails.helpers.getProposalDescription(
          obj,
          inputs.driver.language
        );
        // if (obj.type == global.RFP_TYPE.DELIVERY) {
        //   wasphaFee = parseFloat(
        //     _.find(setting, {
        //       key: "waspha_fee_delivery",
        //     }).value
        //   );
        //   wasphaFeeType = _.find(setting, {
        //     key: "waspha_fee_delivery_type",
        //   }).value;
        // } else {
        //   wasphaFee = parseFloat(
        //     _.find(setting, {
        //       key: "waspha_fee_pickup",
        //     }).value
        //   );
        //   wasphaFeeType = _.find(setting, {
        //     key: "waspha_fee_pickup_type",
        //   }).value;
        // }
        // wasphaFeeAmount = wasphaFee;
        // if (wasphaFeeType == "percentage") {
        //   wasphaFeeAmount = (obj.total_amount * wasphaFee) / 100;
        // }
        // order.price = obj.total_amount + wasphaFeeAmount;

        // if (obj.type == global.RFP_TYPE.DELIVERY) {
        //   order.price += obj.delivery_fee;
        // }
        // if (!_.isUndefined(obj.package_charges) && obj.package_charges) {
        //   order.price = obj.package_charges;
        // }
        total_amount += credit_debit.total_earning;
        order.price = credit_debit.total_earning;
        order.trip_id = obj.trip_id;
        order.customer = {
          id: obj.u_id,
          name: obj.user_name,
        };
        order.vendor = {
          id: obj.s_id,
          name: obj.s_name,
        };
        order.items = await sails.helpers.getProposalItems(obj.proposal_id);
        for (item of order.items) {
          item.name = item.title;
          delete item.title;
        }
        orders.push(order);
        ////trip
        var trip = {};
        trip.id = obj.trip_id;

        if (obj.u_address) {
          trip.origin = {
            name: obj.s_address,
            coordinates: { latitude: obj.s_lat, longitude: obj.s_lng },
          };
          trip.dest = {
            name: obj.u_address,
            coordinates: { latitude: obj.u_lat, longitude: obj.u_lng },
          };
        } else {
          pickup_location = JSON.parse(obj.pickup_location);
          store_location = JSON.parse(store_location);
          trip.origin = {
            name: store_location.address,
            coordinates: {
              latitude: store_location.lat,
              longitude: store_location.lng,
            },
          };
          trip.dest = {
            name: pickup_location.address,
            coordinates: {
              latitude: pickup_location.lat,
              longitude: pickup_location.lng,
            },
          };
        }
        trip.earning = order.price;
        trip.date = obj.trip_date;
        trips.push(trip);
      } //end for
      data.total_earnings = total_amount;
      data.orders = orders;
      data.trips = trips;
      return exits.success({
        status: true,
        message: sails.config.strings[inputs.driver.language].FOUND,
        data: data,
      });
    } catch (err) {
      sails.log(
        `Error in getting earnings for driver id ${inputs.driver.id}. ${err}`
      );
      return exits.ok({
        status: false,
        message: sails.config.strings[inputs.driver.language].NOT_FOUND,
        data: data,
      });
    }
  },
};
