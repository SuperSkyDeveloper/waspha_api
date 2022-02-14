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
    id: {
      type: "number",
      required: true,
    },
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
    sails.log("calling action super-admin/get-report");

    const strings = sails.config.strings[inputs.language];
    let store = await Store.findOne({
      where: { id: inputs.id },
      select: ["business_name"],
    });
    const data = {
      id: store.id,
      business_name: store.business_name,
      total_earning: 0,
      debit_amount: 0,
      credit_amount: 0,
      orders: [],
    };

    try {
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
      AND rfp_store.store_id = ${inputs.id}
      GROUP BY p.id 
      `;
      var result = await sails.sendNativeQuery(query);

      if (result.rows.length) {
        let total = 0;

        data.id = result.rows[0].s_id;
        data.business_name = await sails.helpers.convertHtmlIntoText(
          result.rows[0].s_name
        );
        data.debit_amount = 0;
        data.credit_amount = 0;
        data.total_earning = 0;
        let orders = [];
        for (row of result.rows) {
          let order = {};
          order.id = row.proposal_id;
          order.user = {
            id: row.u_id,
            name: row.u_name,
          };
          total_earning = row.total_earning;
          credit_amount = await sails.helpers.calculateCreditAmount(
            row.type,
            row.total_earning,
            row.delivery_fee
          );
          debit_amount = total_earning - credit_amount;

          total += credit_amount;
          // sails.log({
          //   credit_amount: credit_amount,
          //   debit_amount: debit_amount,
          // });
          order.total_earning = total_earning;
          order.debit_amount = debit_amount;
          order.credit_amount = credit_amount;
          orders.push(order);
          data.total_earning += total_earning;
          data.debit_amount += debit_amount;
          data.credit_amount += credit_amount;
        }
        data.orders = orders;
        //  sails.log({ datadadd: data });
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
      sails.log.error(`Error in action super-admin/get-report. Error: ${err}`);
      return exits.serverError({
        status: true,
        message: strings.NOT_FOUND,
        data: data,
      });
    }
  },
};
