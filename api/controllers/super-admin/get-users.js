module.exports = {
  friendlyName: "User",

  description: "Get all Users.",

  inputs: {
    admin: {
      type: "ref",
      required: true,
      description: "logged in admin",
    },
  },

  exits: {
    unauthorized: {
      responseType: "unauthorized",
      description: "Send 401 if authentication failed",
    },
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action admin/get-users");

    let req = this.req;

    let range = [0, 9];
    if (req.query.range) {
      range = JSON.parse(req.query.range);
    }

    console.log("req.query:", req.query);
    console.log("req.displayedFilter:", req.query.displayedFilters);
    let count_query = `
   SELECT COUNT(u.id) AS total
   FROM users u
   LEFT JOIN user_country uc
     ON uc.user_id = u.id
   WHERE deletedAt IS NULL      
   `;
    let query = `
    SELECT u.id, u.name,u.email,u.contact, u.country_code,u.avatar
    FROM users u
    LEFT JOIN user_country uc
      ON uc.user_id = u.id
    WHERE deletedAt IS NULL      
   `;
    if (req.query.filter) {
      let filter = JSON.parse(req.query.filter);
      if (inputs.admin.role.name == global.ROLE.SUPER_ADMIN) {
        if (filter.countryId) {
          query += ` AND uc.country_id = ${filter.countryId}`;
          count_query += ` AND uc.country_id = ${filter.countryId}`;
        }
      } else {
        query += ` AND uc.country_id = ${inputs.admin.country.id}`;
        count_query += ` AND uc.country_id = ${inputs.admin.country.id}`;
      }
      if (filter.q) {
        query += ` AND (u.name LIKE '%${filter.q}%' OR u.email LIKE '%${filter.q}%' OR u.country_code LIKE '%${filter.q}%' OR u.contact LIKE '%${filter.q}%' OR u.gender LIKE '%${filter.q}%' )`;
        count_query += ` AND (u.name LIKE '%${filter.q}%' OR u.email LIKE '%${filter.q}%' OR u.country_code LIKE '%${filter.q}%' OR u.contact LIKE '%${filter.q}%' OR u.gender LIKE '%${filter.q}%' )`;
        //count_query += ` AND (u.name LIKE '%${filter.q}%' OR u.email LIKE '%${filter.q}%')`;
      }
      if (!_.isUndefined(filter.is_fraud)) {
        query += ` AND u.is_fraud = ${filter.is_fraud} `;
        count_query += ` AND u.is_fraud = ${filter.is_fraud} `;
      }
    }
    // if (req.query.displayedFilters) {
    //   let displayedFilters = JSON.parse(req.query.displayedFilters);
    //   if (!_.isUndefined(displayedFilters.fraud)) {
    //     query += `AND u.is_fraud = ${displayedFilters.fraud}`;
    //     count_query += `AND u.is_fraud = ${displayedFilters.fraud}`;
    //   }
    // }

    var sort = await sails.helpers.getSortFilters(req, true);
    if (sort) {
      query += ` ORDER BY u.${sort} LIMIT ${range[0]},${
        range[1] - range[0] + 1
      }`;
    }
    sails.log({ query: query, sort: sort });

    let result = await sails.sendNativeQuery(query);
    let users = [];
    if (result.rows.length) {
      users = result.rows;
      result = await sails.sendNativeQuery(count_query);
      if (result.rows.length) {
        users[0].total = result.rows[0].total;
      }
    }

    this.req.headers["content-range"] = 1000;

    if (users.length) {
      return exits.success({
        status: true,
        message: sails.config.strings["en"].TOTAL_USERS_FOUND.replace(
          "{total}",
          users.length
        ),
        data: users,
      });
    }
    return exits.ok({
      status: false,
      message: sails.config.strings["en"].NOT_FOUND,
      data: [],
    });
  },
};
