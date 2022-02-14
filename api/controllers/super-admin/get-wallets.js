module.exports = {
  friendlyName: "Get wallets",

  description: "",

  inputs: {
    admin: {
      type: "ref",
      required: true,
      description: "Logged in admin",
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
    notFound: {
      description: "Send notFound response",
      responseType: "notFound",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action super-admin/get-wallets");
    try {
      let query = `
      SELECT u.id,u.name,u.avatar,u.wallet,c.en AS country,c.currency_code AS currency
      FROM users u
      LEFT JOIN user_country uc
        ON uc.user_id = u.id
      LEFT JOIN countries c
        ON c.id = uc.country_id      
      WHERE u.deletedAt IS NULL
      `;
      if (inputs.admin.role.name == global.ROLE.ADMIN) {
        query += ` AND uc.country_id = ${inputs.admin.country.id}`;
      }

      let req = this.req;

      let range = [0, 9];
      if (req.query.range) {
        range = JSON.parse(req.query.range);
      }
      var sort = await sails.helpers.getSortFilters(req, true);
      let filter = JSON.parse(req.query.filter);
      if (filter.user_id) {
        query += ` AND u.id = ${filter.user_id}`;
      }
      if (sort) {
        //query += ` ORDER BY v.${sort} LIMIT ${range[0]},${range[1] + 1}`;
      }
      let result = await sails.sendNativeQuery(query);
      if (result.rows.length) {
        result.rows[0].total = result.rows.length;
        return exits.success({
          status: true,
          message: "Found successfully",
          data: result.rows,
        });
      }
    } catch (err) {
      sails.log.error(`Error in action super-admin/get-wallets. ${err}`);
    }
    return exits.notFound({
      status: false,
      message: "Not found",
      data: [],
    });
  },
};
