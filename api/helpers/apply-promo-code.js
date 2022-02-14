const moment = require("moment");
const strings = sails.config.strings;
module.exports = {
  friendlyName: "Apply promo code",

  description: "",

  inputs: {
    user: {
      type: "ref",
      required: true,
    },
    proposal_id: {
      type: "number",
      required: true,
    },
    payment_method: {
      type: "string",
      required: true,
      //isIn: ['wallet','card','cash_on_delivery']
      isIn: _.values(global.PAYMENT_METHOD),
    },
    promo_code_id: {
      type: "number",
      required: true,
    },
    exclude_checks: {
      type: "boolean",
      defaultsTo: false,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper apply-promo-code");
    try {
      let data = {
        status: false,
        message: strings[inputs.user.language].INVALID_PROMO_CODE,
      };

      let where = {
        id: inputs.promo_code_id,
        deletedAt: null,
        //status_id: { "!=": statuses[global.STATUS.EXPIRED] },
        start_time: { "<=": moment().format("YYYY-MM-DD HH:mm:ss") },
        end_time: { ">": moment().format("YYYY-MM-DD HH:mm:ss") },
      };
      //sails.log({ where });
      let promo_code = await Promo_code.findOne({
        where: where,
        select: [
          "id",
          "start_time",
          "end_time",
          "number_of_uses",
          "promo_code",
          "discount",
          "payment_methods",
          "service_modes",
          "category_id",
          "subcategory_id",
          "apply_on",
          "min_order_amount",
        ],
      });

      if (promo_code) {
        let query = `      
        SELECT  p.id,rfp.id AS rfp_id,s.id AS store_id,s.vendor_id,v.language AS v_language,rfp.type,rfp.subcategory_id
        FROM proposals p
        INNER JOIN request_for_proposal_store rfp_store 
          ON p.rfp_store_id = rfp_store.id
        INNER JOIN stores s
          ON s.id = rfp_store.store_id        
        INNER JOIN vendors v
          ON v.id = s.vendor_id        
        INNER JOIN request_for_proposals rfp 
          ON rfp_store.rfp_id = rfp.id
        WHERE p.id = ${inputs.proposal_id}
        
        `;
        let result = await sails.sendNativeQuery(query);
        proposal = result.rows[0];

        // if (promo_code.vendor_id) {
        //   if (promo_code.vendor_id.id != proposal.store_id) {
        //     data.message = strings[inputs.user.language].INVALID_PROMO_CODE;
        //     return exits.success(data);
        //   }
        // }
        if (
          promo_code.payment_methods &&
          !promo_code.payment_methods.includes(
            inputs.payment_method.toLowerCase()
          )
        ) {
          data.message =
            strings[
              inputs.user.language
            ].PROMO_IS_NOT_APPLICABLE_TO_SELECTED_PAYMENT_METHOD;
          return exits.success(data);
        }
        if (
          promo_code.service_modes &&
          !promo_code.service_modes.includes(proposal.type.toLowerCase())
        ) {
          data.message =
            strings[
              inputs.user.language
            ].PROMO_IS_NOT_APPLICABLE_TO_SELECTED_SERVICE_MODE;
          return exits.success(data);
        }
        if (promo_code.category_id) {
          sails.log({
            pcat: proposal.subcategory_id,
            promcat: promo_code.category_id,
            promsub: promo_code.subcategory_id,
          });
          if (
            proposal.subcategory_id != promo_code.category_id &&
            proposal.subcategory_id != promo_code.subcategory_id
          ) {
            data.message =
              strings[
                inputs.user.language
              ].PROMO_IS_NOT_APPLICABLE_TO_SELECTED_CATEGORY;
            return exits.success(data);
          }
        }

        let allowed = await Promo_code_restricted_user.find({
          promo_code_id: promo_code.id,
        });
        sails.log({ allowed: allowed, prom_id: promo_code.id });
        if (allowed.length) {
          //user_id: inputs.user.id,
          user_ids = _.map(allowed, "user_id");
          if (!user_ids.includes(inputs.user.id)) {
            data.message =
              strings[
                inputs.user.language
              ].YOU_ARE_NOT_ALLOWED_TO_USE_THIS_PROMO;
            return exits.success(data);
          }
        }
        allowed = await Promo_code_restricted_vendor.find({
          promo_code_id: promo_code.id,
        }).limit(1);
        if (allowed.length) {
          store_ids = _.map(allowed, "vendor_id");
          if (!store_ids.includes(proposal.store_id)) {
            data.message =
              strings[
                inputs.user.language
              ].YOU_ARE_NOT_ALLOWED_TO_USE_THIS_PROMO;
            return exits.success(data);
          }
        }

        //checking usage of applied promo code that how many times user used it previously
        query = `SELECT COUNT(p.id) AS total
         FROM request_for_proposals rfp
         INNER JOIN request_for_proposal_store rfp_store
           ON rfp_store.rfp_id = rfp.id
         INNER JOIN proposals p
           ON p.rfp_store_id = rfp_store.id
         WHERE p.promo_code_id = ${promo_code.id}
         AND rfp.user_id = ${inputs.user.id}`;
        result = await sails.sendNativeQuery(query);
        if (result.rows.length) {
          if (result.rows[0].total >= promo_code.number_of_uses) {
            data.message = strings[inputs.user.language].PROMO_LIMIT_REACHED;
            return exits.success(data);
          }
        }
        let invoice = await sails.helpers.getProposalInvoice.with({
          proposal_id: proposal.id,
          language: inputs.user.language,
        });
        //sails.log({ invoice: invoice.bill });
        switch (promo_code.apply_on) {
          case global.PROMO_APPLY_ON.SUBTOTAL: {
            query = `SELECT SUM(i.price*i.quantity) AS total
                    FROM proposal_items i
                    WHERE i.proposal_id = ${proposal.id}`;
            result = await sails.sendNativeQuery(query);

            if (result.rows.length) {
              if (result.rows[0].total < promo_code.min_order_amount) {
                data.message =
                  strings[
                    inputs.user.language
                  ].PROMO_MIN_ORDER_AMOUNT_NOT_REACHED_SUBTOTAL;
                return exits.success(data);
              }
            }
            break;
          }
          case global.PROMO_APPLY_ON.TOTAL: {
            if (invoice.total.value < promo_code.min_order_amount) {
              data.message =
                strings[
                  inputs.user.language
                ].PROMO_MIN_ORDER_AMOUNT_NOT_REACHED_TOTAL;
              return exits.success(data);
            }
            break;
          }
          case global.PROMO_APPLY_ON.WASPHA_FEE: {
            let waspha_fee = _.find(invoice.bill, {
              key: global.PROMO_APPLY_ON.WASPHA_FEE,
            });

            if (waspha_fee.value < promo_code.min_order_amount) {
              data.message =
                strings[
                  inputs.user.language
                ].PROMO_MIN_ORDER_AMOUNT_NOT_REACHED_WASPHA_FEE;
              return exits.success(data);
            }
            break;
          }
          case global.PROMO_APPLY_ON.DELIVERY_FEE: {
            let delivery_fee = _.find(invoice.bill, {
              key: global.PROMO_APPLY_ON.DELIVERY_FEE,
            });
            sails.log({ asdsd: delivery_fee });
            if (delivery_fee.value < promo_code.min_order_amount) {
              data.message =
                strings[
                  inputs.user.language
                ].PROMO_MIN_ORDER_AMOUNT_NOT_REACHED_DELIVERY_FEE;
              return exits.success(data);
            }
            break;
          }
        }

        data.status = true;
        data.message = strings[inputs.user.language].APPLIED;
        delete promo_code.vendor_id;
        data.promo_code = promo_code;
      }
      return exits.success(data);
      // sails.log({ promo_code: promo_code });
    } catch (err) {
      sails.log.error(`Error in helper apply-promo-code. ${err}`);
    }
  },
};
