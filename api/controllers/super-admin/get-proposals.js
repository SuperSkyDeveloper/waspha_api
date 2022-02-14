module.exports = {
  friendlyName: "Get proposals",

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
    sails.log("calling action super-admin/get-proposals");
    try {
      let req = this.req;

      let range = [0, 9];
      if (req.query.range) {
        range = JSON.parse(req.query.range);
      }
      var sort = await sails.helpers.getSortFilters(req, true);

      let count_query = `
      SELECT COUNT(p.id) AS total      
      FROM proposals p
      INNER JOIN statuses s 
        ON s.id = p.status_id
      LEFT JOIN request_for_proposal_store rfp_store
        ON rfp_store.id = p.rfp_store_id
      LEFT JOIN request_for_proposals rfp
        ON rfp_store.rfp_id = rfp.id
      LEFT JOIN stores st 
        ON st.id = rfp_store.store_id
      LEFT JOIN stores pst 
        ON pst.id = p.store_id
      LEFT JOIN vendor_country vc1 
        ON vc1.vendor_id = st.vendor_id
      LEFT JOIN vendor_country vc2
        ON vc2.vendor_id = pst.vendor_id
      WHERE p.deletedAt IS NULL       
      `;
      let query = `
      SELECT p.id,p.type,p.createdAt,
      s.description AS status,st.business_name AS store_name1,pst.business_name AS store_name2
      FROM proposals p
      INNER JOIN statuses s 
        ON s.id = p.status_id
      LEFT JOIN request_for_proposal_store rfp_store
        ON rfp_store.id = p.rfp_store_id
      LEFT JOIN request_for_proposals rfp
        ON rfp_store.rfp_id = rfp.id
      LEFT JOIN stores st 
        ON st.id = rfp_store.store_id
      LEFT JOIN stores pst 
        ON pst.id = p.store_id
      LEFT JOIN vendor_country vc1 
        ON vc1.vendor_id = st.vendor_id
      LEFT JOIN vendor_country vc2
        ON vc2.vendor_id = pst.vendor_id
      
      WHERE p.deletedAt IS NULL       
      `;

      //console.log("req.query:", req.query);
      if (req.query.filter) {
        let filter = JSON.parse(req.query.filter);
        if (filter.category_id) {
          query += `AND rfp.subcategory_id = ${filter.category_id}`;
          count_query += `AND rfp.subcategory_id = ${filter.category_id}`;
        }
        if (filter.rfp_id) {
          query += `AND rfp.id = ${filter.rfp_id}`;
          count_query += `AND rfp.id = ${filter.rfp_id}`;
        }
      }

      if (inputs.admin.role.name == global.ROLE.ADMIN) {
        query += ` AND (vc1.country_id = ${inputs.admin.country.id} OR vc2.country_id = ${inputs.admin.country.id})`;
        count_query += ` AND (vc1.country_id = ${inputs.admin.country.id} OR vc2.country_id = ${inputs.admin.country.id})`;
      }
      query += ` ORDER BY ${sort}
      LIMIT ${range[0]},${range[1] - range[0] + 1}`;
      sails.log(query);
      var result = await sails.sendNativeQuery(query);
      if (result.rows.length) {
        var proposals = result.rows;
        for (p of proposals) {
          p.store_name = p.store_name1 || p.store_name2;
          p.store_name = await sails.helpers.convertHtmlIntoText(p.store_name);
        }
        result = await sails.sendNativeQuery(count_query);
        proposals[0].total = result.rows[0].total;

        return exits.ok({
          status: true,
          message: "proposals found successfully",
          data: proposals,
        });
      }
      return exits.ok({
        status: false,
        message: "Not found1",
        data: [],
      });
    } catch (err) {
      sails.log.error(`Error in getting proposals. ${err}`);
      return exits.notFound({
        status: false,
        message: "Not found2",
        data: [],
      });
    }
  },
};
