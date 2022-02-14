const { setRandomFallback } = require("bcryptjs");

function calculateDebitAmount(order_type, total_earning, delivery_fee) {
  const waspha_fee_on_delivery = 5; //percenatage,will be fetched from database later
  const waspha_fee_on_pickup = 5; //percenatage,will be fetched from database later
  const applied_fee =
    order_type === global.RFP_TYPE.DELIVERY
      ? waspha_fee_on_delivery
      : waspha_fee_on_pickup;
  delivery_fee = order_type === global.RFP_TYPE.DELIVERY ? delivery_fee : 0;
  let debit_amount = (total_earning * applied_fee) / 100;

  return debit_amount + delivery_fee;
}
module.exports = {
  friendlyName: "Store earning",

  description: "",

  inputs: {
    language: {
      type: "string",
      required: false,
      defaultsTo: "en",
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
    sails.log("calling action super-admin/get-reports");
    const strings = sails.config.strings[inputs.language];
    var data = {
      // average_rating: 0,
      // name: inputs.vendor.store.business_name,
      // avatar: inputs.vendor.avatar,
      earning: { todays_earning: 0, total: 0, orders: [] },
    };
    try {
      let req = this.req;

      let range = [0, 9];
      if (req.query.range) {
        range = JSON.parse(req.query.range);
      }
      var sort = await sails.helpers.getSortFilters(req, true);
      // let store = await Store.findOne({ id: inputs.vendor.store.id });
      // data.average_rating = await Store_review_rating.avg("rating").where({
      //   store_id: store.id,
      // });
      // data.average_rating = !_.isUndefined(data.average_rating)
      //   ? parseFloat(data.average_rating.toFixed(2))
      //   : 0;
      // data.name = store.business_name;
      // data.avatar = store.image;
      var query = `
      SELECT  
      rfp_store.rfp_id AS rfp_id,
      p.id AS proposal_id,
      SUM(i.price*i.quantity +(i.price*i.tax_ratio/100)*i.quantity)  AS total_earning ,
      p.createdAt AS order_date,p.delivery_fee,p.payment_method,
      p.type,str.id AS s_id,str.business_name AS s_name,u.id AS u_id,u.name AS u_name
      FROM proposals p
      INNER JOIN request_for_proposal_store rfp_store ON rfp_store.id = p.rfp_store_id
      INNER JOIN request_for_proposals rfp ON rfp.id = rfp_store.rfp_id
      INNER JOIN users u ON u.id = rfp.user_id      
      INNER JOIN stores str ON str.id = rfp_store.store_id
      INNER JOIN proposal_items i ON i.proposal_id = p.id
      INNER JOIN statuses s ON p.status_id = s.id
      WHERE (s.slug = '${global.STATUS.COMPLETED}' OR (s.slug='${global.STATUS.ACCEPTED}' AND p.payment_method='${global.PAYMENT_METHOD.CARD}') )               
      `;
      var count_query = `
      SELECT count(p.id) AS total
      FROM proposals p
      INNER JOIN request_for_proposal_store rfp_store ON rfp_store.id = p.rfp_store_id
      INNER JOIN request_for_proposals rfp ON rfp.id = rfp_store.rfp_id
      INNER JOIN users u ON u.id = rfp.user_id      
      INNER JOIN stores str ON str.id = rfp_store.store_id
      INNER JOIN proposal_items i ON i.proposal_id = p.id
      INNER JOIN statuses s ON p.status_id = s.id
      WHERE (s.slug = '${global.STATUS.COMPLETED}' OR (s.slug='${global.STATUS.ACCEPTED}' AND p.payment_method='${global.PAYMENT_METHOD.CARD}') )               
      `;
      if (req.query.filter) {
        let filter = JSON.parse(req.query.filter);
        if (filter.store_id) {
          query += `AND rfp_store.store_id = ${filter.store_id}`;
          count_query += `AND rfp_store.store_id = ${filter.store_id}`;
        }
      }
      let order = sort.split(" ");
      switch (order[0]) {
        case "vendor.id": {
          sort = `s_id ${order[1]}`;
          break;
        }
        case "vendor.name": {
          sort = `s_name ${order[1]}`;
          break;
        }
        case "id": {
          sort = `p.id ${order[1]}`;
          break;
        }
      }
      query += ` GROUP BY p.id          
      ORDER BY ${sort}      
      LIMIT ${range[0]},${range[1] - range[0] + 1}`;
      sails.log(query);

      var result = await sails.sendNativeQuery(query);
      if (result.rows.length) {
        data = [];

        let total = 0;
        result.rows.forEach(async function (row) {
          const temp = {};
          temp.vendor = {
            id: row.s_id,
            name: row.s_name,
          };
          temp.user = {
            id: row.u_id,
            name: row.u_name,
          };
          temp.id = row.proposal_id;
          temp.order_date = row.order_date;
          temp.total_earning = row.total_earning;
          temp.credit_amount = calculateDebitAmount(
            row.type,
            row.total_earning,
            row.delivery_fee
          );
          temp.debit_amount = temp.total_earning - temp.credit_amount;
          // total += temp.total_earning;
          total += temp.credit_amount;
          data.push(temp);
        });

        // data.earning.todays_earning = await sails.helpers.getStoreTodaysEarning(
        //   store.id
        // );
        // data.earning.todays_earning = data.earning.todays_earning || 0;
        // data.earning.total = parseFloat(total.toFixed(2));
        result = await sails.sendNativeQuery(count_query);

        data[0].total = result.rows[0].total;

        return exits.success({
          status: true,
          message: strings.FOUND,
          data: data,
        });
      }

      return exits.ok({
        status: true,
        message: strings.NOT_FOUND,
        data: data,
      });
    } catch (err) {
      sails.log.error(`Error fetching store earning. Error: ${err}`);
      return exits.serverError({
        status: true,
        message: strings.NOT_FOUND,
        data: data,
      });
    }
  },
};
