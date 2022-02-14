module.exports = {
  friendlyName: "Get rfps",

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
  },

  fn: async function (inputs, exits) {
    sails.log("calling action super-admin/get-rfps");
    try {
      let req = this.req;

      let range = [0, 9];
      if (req.query.range) {
        range = JSON.parse(req.query.range);
      }
      var sort = await sails.helpers.getSortFilters(req, true);

      let select = `SELECT rfp.id,rfp.type,rfp.createdAt,
      c.en AS c_en,c.ar AS c_ar,s.description AS status,u.name as user,u.id AS user_id,u.avatar`;
      let select_count = `SELECT COUNT(rfp.id) AS total`;
      let query = `       
      FROM request_for_proposals rfp
      INNER JOIN users u
        ON u.id = rfp.user_id
      INNER JOIN user_country uc
        ON uc.user_id = u.id
      INNER JOIN categories c
        ON c.id = rfp.subcategory_id
      INNER JOIN statuses s 
        ON s.id = rfp.status_id
      WHERE rfp.deletedAt IS NULL         
      `;
      if (inputs.admin.role.name == global.ROLE.ADMIN) {
        query += ` AND uc.country_id = ${inputs.admin.country.id}`;
      }

      if (req.query.filter) {
        let filter = JSON.parse(req.query.filter);
        if (filter.user_id) {
          query += `AND rfp.user_id = ${filter.user_id}`;
          //count_query += `AND rfp.subcategory_id = ${filter.category_id}`;
        }
      }
      let order = sort.split(" ");
      switch (order[0]) {
        case "category.en": {
          sort = `c_en ${order[1]}`;
          break;
        }
        case "category.ar": {
          sort = `c_ar ${order[1]}`;
          break;
        }
      }

      order_by = ` ORDER BY ${sort}
      LIMIT ${range[0]},${range[1] - range[0] + 1}`;
      //console.log(query);
      var result = await sails.sendNativeQuery(select + query + order_by);
      if (result.rows.length) {
        var rfps = result.rows;
        rfps = rfps.map(function (o) {
          o.category = {
            en: o.c_en,
            ar: o.c_ar,
          };
          delete o.c_en;
          delete o.c_ar;
          o.user = {
            id: o.user_id,
            name: o.user,
            avatar: o.avatar,
          };
          return o;
        });
        let total_result = await sails.sendNativeQuery(select_count + query);
        rfps[0].total = !_.isUndefined(total_result.rows[0])
          ? total_result.rows[0].total
          : 0;

        return exits.ok({
          status: true,
          message: "rfps found successfully",
          data: rfps,
        });
      }
      return exits.ok({
        status: false,
        message: "rfps not found",
        data: [],
      });
    } catch (err) {
      sails.log.error(`Error in getting rfps. ${err}`);
      return exits.ok({
        status: false,
        message: "rfps not found",
        data: [],
      });
    }
  },
};
