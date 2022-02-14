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

      if (req.query.filter) {
        let filter = JSON.parse(req.query.filter);
        if (filter.store_id) {
          query += `AND rfp_store.store_id = ${filter.store_id}`;
          count_query += `AND rfp_store.store_id = ${filter.store_id}`;
        }
      }
      // let order = sort.split(" ");
      // switch (order[0]) {
      //   case "vendor.id": {
      //     sort = `s_id ${order[1]}`;
      //     break;
      //   }
      //   case "vendor.name": {
      //     sort = `s_name ${order[1]}`;
      //     break;
      //   }
      //   case "id": {
      //     sort = `p.id ${order[1]}`;
      //     break;
      //   }
      // }
      query += ` GROUP BY p.id ORDER BY rfp_store.store_id DESC`;
      // query +=`ORDER BY ${sort}
      // LIMIT ${range[0]},${range[1] - range[0] + 1}`;
      sails.log(query);

      var result = await sails.sendNativeQuery(query);

      if (result.rows.length) {
        reports = [];
        let debit_amount = 0;
        let credit_amount = 0;
        let total = 0;
        let i = 0;
        //  result.rows.forEach(async function (row) {
        for (row of result.rows) {
          const temp = {};
          temp.vendor = {
            id: row.s_id,
            name: row.s_name,
          };
          // temp.user = {
          //   id: row.u_id,
          //   name: row.u_name,
          // };
          temp.id = row.proposal_id;
          //temp.id = row.s_id;
          //temp.order_date = row.order_date;
          let credit_debit = await sails.helpers.vendor.calculateCreditDebit(
            temp.id
          );
          // temp.total_earning = row.total_earning;
          // temp.credit_amount = calculateDebitAmount(
          //   row.type,
          //   row.total_earning,
          //   row.delivery_fee
          // );
          // temp.debit_amount = temp.total_earning - temp.credit_amount;
          // total += temp.total_earning;

          temp.credit_amount = credit_debit.credit;
          temp.debit_amount = credit_debit.debit;
          temp.total_earning = credit_debit.total_earning;
          total += temp.credit_amount;
          debit_amount += temp.debit_amount;
          credit_amount += temp.credit_amount;

          let next_vendor = !_.isUndefined(result.rows[i + 1])
            ? result.rows[i + 1].s_id
            : null;
          // sails.log({ current: temp, next: next_vendor });
          if (temp.vendor.id != next_vendor) {
            temp.debit_amount = debit_amount;
            temp.credit_amount = credit_amount;
            reports.push(temp);
            debit_amount = 0;
            credit_amount = 0;
          }
          previous_vendor = temp.vendor.id;
          i++;
        }

        //reports[0].total = result.rows[0].total;
        sails.log({ sort: sort, range: range });
        let stores = await Store.find({ deletedAt: null })
          .skip(range[0])
          .sort(sort)
          .limit(range[1] - range[0] + 1);
        let data = [];
        for (store of stores) {
          temp = {};
          temp.id = store.id;
          temp.business_name = await sails.helpers.convertHtmlIntoText(
            store.business_name
          );
          temp.credit_amount = 0;
          temp.debit_amount = 0;
          let found = _.find(reports, { vendor: { id: temp.id } });
          if (found) {
            temp.credit_amount = found.credit_amount;
            temp.debit_amount = found.debit_amount;
          }
          data.push(temp);
        }
        data[0].total = await Store.count({ deletedAt: null });
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
