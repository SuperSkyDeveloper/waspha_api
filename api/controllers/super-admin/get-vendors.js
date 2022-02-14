module.exports = {
  friendlyName: "Get providers",

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
    sails.log("calling action super-admin/get-vendors");
    try {
      let req = this.req;

      let range = [0, 9];
      if (req.query.range) {
        range = JSON.parse(req.query.range);
      }

      var sort = await sails.helpers.getSortFilters(req, true);

      console.log("req.query:", req.query);
      let count_query = `
      SELECT COUNT(v.id) AS total
      FROM vendors v
      LEFT JOIN vendor_country vc
        ON vc.vendor_id = v.id
      INNER JOIN stores s
        ON s.vendor_id = v.id
      WHERE v.deletedAt IS NULL   
      AND s.deletedAt IS NULL        
      `;
      let query = `
      SELECT s.id, s.business_name AS name,s.address,s.country_code,s.phone,s.is_online,s.waspha_fee_delivery,s.waspha_fee_delivery_type,s.waspha_fee_pickup,s.waspha_fee_pickup_type,
      s.credit_amount,s.debit_amount,s.is_waspha_express_subscribed,s.image,
      v.status AS is_approved,v.id AS owner_id,v.name AS owner,
      (SELECT c.id FROM categories c INNER JOIN store_subcategory sc ON sc.subcategory_id = c.id WHERE sc.store_id = s.id ORDER BY sc.id  ASC LIMIT 1)  AS category_id,
      (SELECT c.en FROM categories c INNER JOIN store_subcategory sc ON sc.subcategory_id = c.id WHERE sc.store_id = s.id ORDER BY sc.id  ASC LIMIT 1)  AS category_en,
      (SELECT c.ar FROM categories c INNER JOIN store_subcategory sc ON sc.subcategory_id = c.id WHERE sc.store_id = s.id ORDER BY sc.id  ASC LIMIT 1)  AS category_ar
      FROM vendors v
      INNER JOIN stores s
        ON s.vendor_id = v.id
      LEFT JOIN vendor_country vc
        ON vc.vendor_id = v.id
      WHERE v.deletedAt IS NULL
      AND s.deletedAt IS NULL
      `;
      // let query = `
      // SELECT DISTINCT(s.id), s.business_name AS name,s.address,s.country_code,s.phone,v.status AS is_approved,
      // v.id AS owner_id,v.name AS owner,c.c_en,c.c_ar

      // FROM vendors v
      // INNER JOIN stores s
      //   ON s.vendor_id = v.id
      // INNER JOIN (SELECT en AS c_en,ar AS c_ar,sc.store_id FROM categories c INNER JOIN store_subcategory sc ON sc.subcategory_id = c.id ORDER BY sc.id ASC) c ON c.store_id = s.id
      // LEFT JOIN vendor_country vc
      //   ON vc.vendor_id = v.id
      // WHERE v.deletedAt IS NULL
      // AND s.deletedAt IS NULL
      // `;

      if (req.query.filter) {
        let filter = JSON.parse(req.query.filter);
        if (filter.countryId) {
          query += `AND vc.country_id = ${filter.countryId}`;
          count_query += `AND vc.country_id = ${filter.countryId}`;
        }
        if (!_.isUndefined(filter.isApproved)) {
          query += ` AND v.status = ${filter.isApproved}`;
        }
        if (filter.q) {
          query += ` AND (v.name LIKE '%${filter.q}%' OR s.business_name LIKE '%${filter.q}%' OR s.address LIKE '%${filter.q}%' OR s.id LIKE '%${filter.q}%' )`;
          count_query += ` AND (v.name LIKE '%${filter.q}%' OR s.business_name LIKE '%${filter.q}%' OR s.address LIKE '%${filter.q}%' OR s.id LIKE '%${filter.q}%' )`;
        }
      }
      if (inputs.admin.role.name == global.ROLE.ADMIN) {
        query += ` AND vc.country_id = ${inputs.admin.country.id}`;
        count_query += ` AND vc.country_id = ${inputs.admin.country.id}`;
      }

      if (sort) {
        let order = sort.split(" ");
        switch (order[0]) {
          case "category.en": {
            sort = `category_en ${order[1]}`;
            break;
          }
          case "category.ar": {
            sort = `category_ar ${order[1]}`;
            break;
          }
          case "address": {
            sort = `s.address ${order[1]}`;
            break;
          }
        }
        query += ` ORDER BY s.${sort} LIMIT ${range[0]},${
          range[1] - range[0] + 1
        }`;
      }

      let categories = await Category.find();
      //  sails.log(query);
      let result = await sails.sendNativeQuery(query);
      let stores = [];
      if (result.rows.length) {
        stores = result.rows;
        result = await sails.sendNativeQuery(count_query);
        if (result.rows.length) {
          sails.log({ total: result.rows[0].total });
          stores[0].total = result.rows[0].total;
        }

        let store_services = await Store_service.find({
          store: _.map(stores, "id"),
        });

        for (store of stores) {
          store.name = await sails.helpers.convertHtmlIntoText(store.name);
          store.is_waspha_express_subscribed = Boolean(
            store.is_waspha_express_subscribed
          );
          let category = _.find(categories, { id: store.category_id });
          //sails.log({ category122: category });
          if (category) {
            store.category = {
              en: category.en,
              ar: category.ar,
            };
            delete store.category_id;
          }

          store.is_approved = Boolean(store.is_approved);
          store.is_online = Boolean(store.is_online);

          store.services = {
            waspha_box: false,
            waspha_express: false,
            delivery: false,
            pickup: false,
          };
          service = _.find(store_services, { store: store.id });
          if (service) {
            store.services = {
              waspha_box: Boolean(service.waspha_box),
              waspha_express: Boolean(service.waspha_express),
              delivery: Boolean(service.delivery),
              pickup: Boolean(service.pickup),
            };
          }
        }

        //this.res.set("Content-Range", "4444");
        return exits.ok({
          status: true,
          message: `${stores.length} Vendors found successfully`,
          data: stores,
        });
      }
      return exits.ok({
        status: false,
        message: "Vendors not found",
        data: [],
      });
    } catch (err) {
      sails.log.error(`Error in getting vendors. ${err}`);
      return exits.ok({
        status: false,
        message: "Vendors not found",
        data: [],
      });
    }
  },
};
