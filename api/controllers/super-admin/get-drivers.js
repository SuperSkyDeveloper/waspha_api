module.exports = {
  friendlyName: "driver",

  description: "Get all drivers.",

  inputs: {
    // admin: {
    //   type: 'ref',
    //   required: true,
    //   description: 'logged in admin'
    // },
  },

  exits: {
    unauthorized: {
      responseType: "unauthorized",
      description: "Send 401 if authentication failed",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action admin/get-drivers");

    let req = this.req;

    let range = [0, 9];
    if (req.query.range) {
      range = JSON.parse(req.query.range);
    }

    let count_query = `
  SELECT COUNT(u.id) AS total
  FROM drivers u
  LEFT JOIN driver_country dc
    ON dc.driver_id = u.id
  WHERE deletedAt IS NULL      
  `;
    let query = `
   SELECT u.id, u.name,u.email,u.contact, u.country_code,u.type,u.status AS is_approved,u.zone_option,u.document,u.avatar
   FROM drivers u
   LEFT JOIN driver_country dc
     ON dc.driver_id = u.id
   WHERE deletedAt IS NULL      
  `;
    if (req.query.filter) {
      let filter = JSON.parse(req.query.filter);
      if (filter.countryId) {
        query += ` AND dc.country_id = ${filter.countryId}`;
        count_query += `AND dc.country_id = ${filter.countryId}`;
      }
      if (filter.storeId) {
        query += ` AND u.store_id = ${filter.storeId}`;
        count_query += ` AND u.store_id = ${filter.storeId}`;
      }
      if (filter.status && filter.status != global.DRIVER_TYPE.ALL) {
        query += `  AND u.type = '${filter.status}'`;
        count_query += `  AND u.type = '${filter.status}'`;
      }
      if (!_.isUndefined(filter.is_approved)) {
        query += `  AND u.status = ${filter.is_approved}`;
        count_query += `  AND u.status = ${filter.is_approved}`;
      }
      if (filter.q) {
        query += ` AND (u.name LIKE '%${filter.q}%' OR u.email LIKE '%${filter.q}%' OR u.type LIKE '%${filter.q}%' )`;
        count_query += ` AND (u.name LIKE '%${filter.q}%' OR u.email LIKE '%${filter.q}%' OR u.type LIKE '%${filter.q}%' )`;
      }
    }
    var sort = await sails.helpers.getSortFilters(req, true);
    if (sort) {
      query += ` ORDER BY u.${sort} LIMIT ${range[0]},${
        range[1] - range[0] + 1
      }`;
    }

    sails.log({ reqQuery: JSON.stringify(req.query) });
    sails.log(query);

    let result = await sails.sendNativeQuery(query);
    let drivers = [];
    if (result.rows.length) {
      drivers = result.rows;
      for (driver of drivers) {
        driver.documents = await Driver_document.find({ driver_id: driver.id });
        if (driver.documents.length) {
          driver.document = driver.documents[0].document;
          //driver.documents = _.map(driver.documents, "document");
        }
        driver.is_approved = Boolean(driver.is_approved);
      }
      result = await sails.sendNativeQuery(count_query);
      if (result.rows.length) {
        drivers[0].total = result.rows[0].total;
      }
    }

    return exits.success({
      status: true,
      message: sails.config.strings["en"].TOTAL_RECORDS_FOUND.replace(
        "{total}",
        drivers.length
      ).replace("{records}", "drivers"),
      data: drivers,
    });
  },
};
