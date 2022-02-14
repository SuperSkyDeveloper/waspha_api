const moment = require("moment");
module.exports = {
  friendlyName: "Get proposal driver",

  description: "",

  inputs: {
    proposal_id: {
      type: "number",
      required: true,
    },
    language: {
      type: "string",
      required: false,
      defaultsTo: "en",
    },
  },

  exits: {
    success: {
      outputFriendlyName: "Proposal driver",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper get-proposal-driver");
    var statuses = await sails.helpers.getAllStatuses();
    let query = `
    SELECT u.id as user_id, u.name as user_name, u.avatar as user_avatar,u.country_code,u.contact, p.createdAt as order_date,rfp_store.id as rfp_store_id,rfp_store.status_id,
    rfp.id as rfp_id,rfp.delivery_location,rfp.lat,rfp.lng,rfp.landmark,rfp.createdAt as order_placed,p.id as proposal_id,p.delivery_mode_id,
    p.delivery_vehicle_id,p.type,p.eta,s.slug as status,p.createdAt AS order_date
    FROM users u
    INNER JOIN request_for_proposals rfp ON u.id = rfp.user_id
    INNER JOIN request_for_proposal_store rfp_store ON rfp.id = rfp_store.rfp_id
    INNER JOIN proposals p ON rfp_store.id = p.rfp_store_id    
    INNER JOIN statuses s ON p.status_id = s.id
    INNER JOIN delivery_modes dm ON dm.id = p.delivery_mode_id
    WHERE p.id = ${inputs.proposal_id}       
    `;

    var result = await sails.sendNativeQuery(query);
    let order = null;
    if (result.rows.length) {
      order = result.rows[0];
    }

    query = `
    SELECT d.*,dv.color_image 
    FROM drivers d
    INNER JOIN proposal_driver pd
      ON pd.driver_id = d.id
    LEFT JOIN delivery_vehicles dv
      ON dv.id = d.vehicle_id
    WHERE 
      proposal_id = ${inputs.proposal_id}
      AND 
      (status_id IN (${statuses.pending},${statuses.accepted},${statuses.completed},${statuses.at_pickup},${statuses.picked_up},${statuses.delivery_started},
        ${statuses.at_delivery},${statuses.delivery_confirmed},${statuses.payment_received})
        OR d.type = 'offline'
      )       
      ORDER BY pd.createdAt DESC
      LIMIT 1     
    `;

    result = await sails.sendNativeQuery(query);
    let assigned_driver = result.rows.length > 0 ? result.rows[0] : null;

    let driver = null;
    if (assigned_driver) {
      sails.log({ assigned_driver: assigned_driver });
      driver = {};
      driver["id"] = assigned_driver.id;
      driver["name"] = assigned_driver.name;
      driver["avatar"] = assigned_driver.avatar;
      driver["contact"] = {
        country_code: assigned_driver.country_code,
        number: assigned_driver.contact,
      };
      driver["location"] = {
        address: assigned_driver.address,
        lat: assigned_driver.lat,
        lng: assigned_driver.lng,
      };
      driver["rc_id"] = assigned_driver.rc_id;
      driver["rc_username"] = assigned_driver.rc_username;
      driver["vehicle_icon"] = assigned_driver.color_image;
      driver["rating"] = await sails.helpers.general.getAvgRating(
        assigned_driver.id,
        global.ROLE.DRIVER
      );
      driver["delivery_time"] =
        order.eta || moment(order.order_date).add(60, "minutes");
      driver["items_received"] = await sails.helpers.getProposalDescription(
        order,
        inputs.language
      );
    } else {
      // driver['id'] =  1;
      // driver['name'] =  'abc';
      // driver['avatar'] = 'https://waspha.s3.amazonaws.com/users/Qbg9nul5hK.png';
      //  driver['contact'] = {
      //   country_code: '+92',
      //   number: '3101011011',
      // };
      // driver['location'] = {
      //   address: 'Sohag, Sohag Governorate, Egypt',
      //   lat: 26.549999,
      //   lng: 31.700001
      // };
      // driver['vehicle_icon'] = 'https://waspha.s3.amazonaws.com/vehicles/3u7Ad78leX.png';
      // driver['rating'] = 4.5;
    }

    return exits.success(driver);
  },
};
