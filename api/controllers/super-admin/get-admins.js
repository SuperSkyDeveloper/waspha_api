module.exports = {
  friendlyName: "admin",

  description: "Get all admins.",

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
    sails.log("calling action admin/get-admins");
    let language = inputs.admin.language;
    try {
      let req = this.req;

      let range = [0, 9];
      if (req.query.range) {
        range = JSON.parse(req.query.range);
      }

      console.log("req.query:", req.query);
      console.log("req.displayedFilter:", req.query.displayedFilters);
      let count_query = `
   SELECT COUNT(u.id) AS total
   FROM admins u
   LEFT JOIN admin_country uc
     ON uc.admin_id = u.id
   WHERE u.deletedAt IS NULL   
   AND u.id != ${inputs.admin.id}   
   `;
      let query = `
    SELECT u.id, u.name,u.email,u.contact, u.country_code,u.avatar,r.display_name AS role
    FROM admins u
    LEFT JOIN admin_country uc
      ON uc.admin_id = u.id
    LEFT JOIN roles r
      ON r.id = u.role_id
    WHERE u.deletedAt IS NULL      
    AND u.id != ${inputs.admin.id}
   `;
      if (req.query.filter) {
        let filter = JSON.parse(req.query.filter);
        if (filter.countryId) {
          query += ` AND uc.country_id = ${filter.countryId}`;
          count_query += ` AND uc.country_id = ${filter.countryId}`;
        }
        if (filter.q) {
          query += ` AND (u.name LIKE '%${filter.q}%' OR u.email LIKE '%${filter.q}%' )`;
          count_query += ` AND (u.name LIKE '%${filter.q}%' OR u.email LIKE '%${filter.q}%')`;
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
      let admins = [];
      if (result.rows.length) {
        admins = result.rows;
        result = await sails.sendNativeQuery(count_query);
        if (result.rows.length) {
          admins[0].total = result.rows[0].total;
        }
      }

      this.req.headers["content-range"] = 1000;

      if (admins.length) {
        return exits.success({
          status: true,
          message: sails.config.strings[language].TOTAL_RECORDS_FOUND.replace(
            "{total}",
            admins.length
          ),
          data: admins,
        });
      }
      return exits.ok({
        status: false,
        message: sails.config.strings[language].NOT_FOUND,
        data: [],
      });
    } catch (err) {
      sails.log.error(`Error in action super-admin/get-admins. ${err}`);
      return exits.ok({
        status: false,
        message: sails.config.strings["en"].NOT_FOUND,
        data: [],
      });
    }
  },
};
