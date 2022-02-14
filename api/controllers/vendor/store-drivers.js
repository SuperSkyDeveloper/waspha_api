module.exports = {
  friendlyName: "Store drivers",

  description: "",

  inputs: {
    vendor: {
      type: "ref",
      required: true,
      description: "logged in vendor",
    },
    type: {
      type: "string",
      required: false,
      isIn: ["online", "offline"],
    },
    is_available: {
      type: "boolean",
      required: false,
    },
    vehicle_id: {
      type: "number",
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
    sails.log("calling action vendor/store-drivers");

    const statuses = await sails.helpers.getAllStatuses();
    var query = `
    SELECT DISTINCT d.* FROM drivers d
      LEFT JOIN proposal_driver pd ON pd.driver_id = d.id
    WHERE d.store_id = ${inputs.vendor.store.id}
    AND d.status = 1
    AND d.deletedAt IS NULL   
    `;
    var where = { store_id: inputs.vendor.store.id, deletedAt: null };
    if (!_.isUndefined(inputs.type)) {
      if (inputs.type == global.DRIVER_TYPE.ONLINE) {
        query += ` AND d.is_online = 1`;
      }
      query += ` AND d.type = '${inputs.type}'`;
    }
    if (!_.isUndefined(inputs.is_available)) {
      if (_.isUndefined(inputs.type)) {
        query += ` AND (d.type = '${global.DRIVER_TYPE.OFFLINE}' OR d.type = '${global.DRIVER_TYPE.ONLINE}' AND d.is_online = 1)`;
      }
      if (inputs.is_available === true) {
        query += ` AND d.id NOT IN (SELECT driver_id FROM proposal_driver WHERE status_id IN (${statuses.pending},${statuses.accepted}))`;
      } else {
        query += ` AND d.id IN (SELECT driver_id FROM proposal_driver WHERE status_id IN (${statuses.pending},${statuses.accepted}))`;
      }
    }

    if (inputs.vehicle_id) {
      query += ` AND d.vehicle_id = ${inputs.vehicle_id}`;
    }
    console.log(query);

    var result = await sails.sendNativeQuery(query);

    var all_drivers = [];

    if (result.rows.length) {
      // result.rows.forEach(function(driver){
      for (driver of result.rows) {
        var d = {};
        d.id = driver.id;
        var ride = await sails.helpers.hasRide(driver.id);
        console.log("ride:", ride);
        d.ride_status = ride !== false ? true : false;
        d.proposal_id = ride !== false ? ride.proposal_id : null;
        d.name = driver.name;
        d.email = driver.email;
        d.country_code = driver.country_code;
        d.contact = driver.contact;
        d.avatar = driver.avatar;
        d.is_online = driver.is_online == 1 ? true : false;
        d.vehicle_id = driver.vehicle_id;
        d.type = driver.type;
        d.rc_id = driver.rc_id;
        d.rc_username = driver.rc_username;
        d.location = {
          address: driver.address,
          lat: driver.lat,
          lng: driver.lng,
        };
        d.avg_rating = await sails.helpers.general.getAvgRating(
          d.id,
          global.ROLE.DRIVER
        );
        all_drivers.push(d);
      } //endfor
      return exits.success({
        status: true,
        message: sails.config.strings[
          inputs.vendor.language
        ].DRIVERS_FOUND.replace("{total}", result.rows.length),
        data: all_drivers,
      });
    }
    return exits.ok({
      status: true,
      message: sails.config.strings[inputs.vendor.language].DRIVERS_NOT_FOUND,
      data: [],
    });
  },
};
