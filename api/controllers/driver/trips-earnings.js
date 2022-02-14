const moment = require("moment");
module.exports = {
  friendlyName: "Trips earnings",

  description: "Trips earnings driver.",

  inputs: {
    driver: {
      type: "ref",
      required: true,
      description: "logged in driver",
    },
    day: {
      type: "string",
      required: false,
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
    sails.log("calling action driver/trips-earnings");

    const statuses = await sails.helpers.getAllStatuses();
    let day = "";
    if (inputs.day) {
      day = ` DATE(pd.createdAt) = '${moment(inputs.day).format(
        "YYYY-MM-DD"
      )}' AND `;
    }
    try {
      var query = `
      SELECT  
        rfp_store.rfp_id AS rfp_id,p.id AS proposal_id,
        SUM(i.price*i.quantity +(i.price*i.tax_ratio/100)*i.quantity) AS total_amount ,p.createdAt AS order_date,
        p.type, pd.id AS trip_id,pd.createdAt AS trip_date,u.id AS u_id,u.name AS user_name,u.avatar AS u_avatar,
        st.id AS s_id,st.business_name AS s_name,st.address AS s_address,
        st.lat AS s_lat, st.lng AS s_lng,rfp.delivery_location AS u_address,rfp.lat AS u_lat,
        rfp.lng AS u_lng
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
        ${day}
        pd.driver_id = ${inputs.driver.id}
      AND 
        s.id = ${statuses.completed}
      AND 
        ds.id = ${statuses.payment_received}
      GROUP BY 
        p.id  ,pd.id
      ORDER BY 
        pd.createdAt DESC
      LIMIT 5
      `;
      var to_query = ` 
      SELECT  
        NULL AS rfp_id,p.id AS proposal_id,
        SUM(i.price*i.quantity +(i.price*i.tax_ratio/100)*i.quantity) AS total_amount ,p.createdAt AS order_date,
        p.type,p.order_type,p.package_charges, pd.id AS trip_id,pd.createdAt AS trip_date,NULL AS u_id,NULL AS user_name,NULL AS u_avatar,
        st.id AS s_id,st.business_name AS s_name,st.address AS s_address,
        st.lat AS s_lat, st.lng AS s_lng,p.pickup_location,p.delivery_location,NULL AS u_lat,
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
        ${day}
        pd.driver_id = ${inputs.driver.id}
      AND 
        s.id = ${statuses.completed}
      AND 
        ds.id = ${statuses.payment_received}
      GROUP BY 
        p.id  ,pd.id
      ORDER BY 
        pd.createdAt DESC
      LIMIT 5
  `;

      var result = await sails.sendNativeQuery(query);
      var merged_result = [];
      if (result.rows.length) {
        merged_result = result.rows;
      }
      result = await sails.sendNativeQuery(to_query);
      if (result.rows.length) {
        merged_result = _.union(merged_result, result.rows);
      }
      if (!merged_result.length) {
        return exits.ok({
          status: true,
          message: sails.config.strings[inputs.driver.language].NOT_FOUND,
          data: [],
        });
      }
      merged_result = _.sortByOrder(merged_result, ["trip_date"], ["desc"]);

      var trips = [];
      var data = {
        total_amount: 0,
        date: merged_result[0].trip_date,
        trips_completed: merged_result.length,
      };
      for (obj of merged_result) {
        let credit_debit = await sails.helpers.driver.calculateCreditDebit(
          obj.proposal_id,
          inputs.driver.id
        );
        ////trip
        var trip = {};
        trip.id = obj.trip_id;
        // trip.amount = obj.total_amount || obj.package_charges;
        trip.amount = credit_debit.total_earning;
        trip.date = obj.trip_date;
        trips.push(trip);
        //data.total_amount += obj.total_amount || obj.package_charges;
        data.total_amount += trip.amount;
      } //end for
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
        status: true,
        message: sails.config.strings[inputs.driver.language].NOT_FOUND,
        data: [],
      });
    }
  },
};
