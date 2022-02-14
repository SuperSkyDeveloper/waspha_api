module.exports = {
  friendlyName: "Store dashboard",

  description: "",

  inputs: {
    vendor: {
      type: "ref",
      required: true,
      description: "logged in vendor",
    },
    filter: {
      type: "string",
      required: false,
      isIn: ["monthly", "weekly", "yearly"],
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
    sails.log("calling action vendor/store-dashboard");

    //let strings = sails.config.strings;
    const strings = sails.config.strings[inputs.vendor.language];
    //sails.log({ strings: strings });
    var data = {
      todays_earning: 0,
      filter: inputs.filter || null,
      earning: [],
    };
    try {
      var query = `
      SELECT SUM(price) AS total_earning, earning_day, earning_date,earning_month FROM (

        SELECT 
        rfp_store.id AS store_id ,        
        (i.price*i.quantity  + i.tax_ratio*i.price/100*i.quantity)  AS price,
        DATE(p.createdAt)  AS earning_date,    
        DAYNAME(p.createdAt) AS earning_day,    
        MONTHNAME(p.createdAt) AS earning_month
        
        FROM proposals p
        INNER JOIN request_for_proposal_store rfp_store ON rfp_store.id = p.rfp_store_id
        INNER JOIN proposal_items i ON i.proposal_id = p.id
        INNER JOIN statuses s ON p.status_id = s.id
        WHERE rfp_store.store_id = ${inputs.vendor.store.id}
          AND (s.slug = '${global.STATUS.COMPLETED}' OR (s.slug='${global.STATUS.ACCEPTED}' AND p.payment_method='${global.PAYMENT_METHOD.CARD}') )          
      `;
      if (!_.isUndefined(inputs.filter)) {
        switch (inputs.filter) {
          case "weekly": {
            query += `  AND p.createdAt BETWEEN DATE_SUB(NOW(),INTERVAL 1 WEEK) AND NOW()`;
            break;
          }
          case "monthly": {
            query += `  AND p.createdAt BETWEEN DATE_SUB(NOW(),INTERVAL 1 MONTH) AND NOW()`;
            break;
          }
          case "yearly": {
            query += `  AND p.createdAt BETWEEN DATE_SUB(NOW(),INTERVAL 1 YEAR) AND NOW()`;
            // query += `  AND YEAR(p.createdAt) = YEAR(CURDATE())`
            break;
          }
        }
      } else {
        query += `  AND p.createdAt BETWEEN DATE_SUB(NOW(),INTERVAL 2 MONTH) AND NOW()`;
      }
      query += ` ) AS xyz`;
      if (!_.isUndefined(inputs.filter) && inputs.filter == "yearly") {
        query += `  GROUP BY earning_month`;
      } else {
        query += `  GROUP BY earning_day,earning_date`;
      }
      query += ` ORDER BY  earning_date DESC `;
      // sails.log(query);

      const result = await sails.sendNativeQuery(query);
      if (result.rows.length) {
        let earning = result.rows;
        //earning.map(value => value.earning_label = (!_.isUndefined(inputs.filter) && inputs.filter == 'yearly')?value.earning_month:value.earning_day);
        earning = _.map(earning, function (obj) {
          sails.log({
            lang: inputs.vendor.language,
            earning_month: obj.earning_month,
            // adsd: strings[inputs.vendor.language]["MONTH"][obj.earning_month],
          });
          obj.earning_label =
            !_.isUndefined(inputs.filter) && inputs.filter == "yearly"
              ? strings["MONTH"][obj.earning_month]
              : strings["DAY"][obj.earning_day];
          obj.earning_day =
            !_.isUndefined(inputs.filter) && inputs.filter == "yearly"
              ? obj.earning_month
              : obj.earning_day;
          obj.earning_day = obj.earning_label;
          delete obj.earning_month;
          return obj;
        });

        data.todays_earning = await sails.helpers.getStoreTodaysEarning(
          inputs.vendor.store.id
        );
        data.todays_earning = data.todays_earning || 0;
        data.earning = earning;
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
      sails.log.error(
        `Error fetching dashboard details for store id ${inputs.vendor.store.id}. ${err}`
      );
      return exits.serverError({
        status: true,
        message: strings.NOT_FOUND,
        data: data,
      });
    }
  },
};
