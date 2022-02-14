module.exports = {
  friendlyName: "Store earning",

  description: "",

  inputs: {
    vendor: {
      type: "ref",
      required: true,
      description: "logged in vendor",
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
    sails.log("action vendor/store-earning started");
    const strings = sails.config.strings[inputs.vendor.language];
    var data = {
      average_rating: 0,
      name: inputs.vendor.store.business_name,
      avatar: inputs.vendor.avatar,
      earning: { todays_earning: 0, total: 0, orders: [] },
    };
    try {
      let store = await Store.findOne({ id: inputs.vendor.store.id });
      data.average_rating = await Store_review_rating.avg("rating").where({
        store_id: store.id,
      });
      data.average_rating = !_.isUndefined(data.average_rating)
        ? parseFloat(data.average_rating.toFixed(2))
        : 0;
      data.name = store.business_name;
      data.avatar = store.image;
      var query = `
      SELECT  
        rfp_store.rfp_id AS rfp_id,
        p.id AS proposal_id,
        SUM(i.price*i.quantity +(i.price*i.tax_ratio/100)*i.quantity)  AS total_earning ,
        p.createdAt AS order_date,p.delivery_fee,
        p.type 
      FROM proposals p
      INNER JOIN request_for_proposal_store rfp_store ON rfp_store.id = p.rfp_store_id
      INNER JOIN proposal_items i ON i.proposal_id = p.id
      INNER JOIN statuses s ON p.status_id = s.id
      WHERE rfp_store.store_id = ${inputs.vendor.store.id}
      AND (s.slug = '${global.STATUS.COMPLETED}' OR (s.slug='${global.STATUS.ACCEPTED}' AND p.payment_method='${global.PAYMENT_METHOD.CARD}') )          
      GROUP BY p.id    
      ORDER BY p.createdAt DESC
      `;

      var to_query = `
      SELECT  
        NULL AS rfp_id,
        p.id AS proposal_id,        
        p.createdAt AS order_date,p.delivery_fee,
        p.type 
      FROM proposals p      
      INNER JOIN proposal_items i ON i.proposal_id = p.id
      INNER JOIN statuses s ON p.status_id = s.id
      WHERE p.store_id = ${inputs.vendor.store.id}
      AND (s.slug = '${global.STATUS.COMPLETED}' OR (s.slug='${global.STATUS.ACCEPTED}' AND p.payment_method='${global.PAYMENT_METHOD.CARD}') )          
      GROUP BY p.id    
      ORDER BY p.createdAt DESC
      `;
      console.log(to_query);
      var result = await sails.sendNativeQuery(query);
      let merged_result = [];
      if (result.rows.length) {
        merged_result = result.rows;
      }
      result = await sails.sendNativeQuery(to_query);
      if (result.rows.length) {
        merged_result = _.union(merged_result, result.rows);
        merged_result = _.sortByOrder(merged_result, ["proposal_id"], ["desc"]);
      }
      if (merged_result.length) {
        data.earning = { orders: [] };

        let total = 0;
        let orders_to_update = [];
        for (row of merged_result) {
          const temp = {};
          temp.order_id = row.proposal_id;
          temp.order_date = row.order_date;

          let credit_debit = await sails.helpers.vendor.calculateCreditDebit(
            row.proposal_id
          );
          temp.credit_amount = credit_debit.credit;
          temp.debit_amount = credit_debit.debit;
          temp.total_earning = credit_debit.total_earning;
          total += temp.total_earning;
          data.earning.orders.push(temp);
          if (!_.isEmpty(credit_debit.to_update)) {
            orders_to_update.push(credit_debit.to_update);
          }
        }
        sails.log({ orders_to_update: orders_to_update });

        data.earning.todays_earning = await sails.helpers.getStoreTodaysEarning(
          store.id
        );
        data.earning.todays_earning = data.earning.todays_earning || 0;
        data.earning.total = parseFloat(total.toFixed(2));
        sails.log("action vendor/store-earning ended");
        return exits.success({
          status: true,
          message: strings.FOUND,
          data: data,
        });
      }
      sails.log("action vendor/store-earning ended");
      return exits.ok({
        status: true,
        message: strings.NOT_FOUND,
        data: data,
      });
    } catch (err) {
      sails.log.error(
        `Error fetching store earning for store id ${inputs.vendor.store.id}. Error: ${err}`
      );
      sails.log("action vendor/store-earning ended");
      return exits.serverError({
        status: true,
        message: strings.NOT_FOUND,
        data: data,
      });
    }
  },
};
