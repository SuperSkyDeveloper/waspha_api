function getMaxDiscount(promo_code, discounted_total) {
  if (promo_code.max_discount && discounted_total > promo_code.max_discount) {
    discounted_total = promo_code.max_discount;
  }
  return discounted_total;
}

module.exports = {
  friendlyName: "Modify invoice",

  description: "",

  inputs: {
    invoice: {
      type: "json",
      required: true,
    },
    promo_code: {
      type: "ref",
      required: true,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper modify-invoice");
    try {
      let invoice = inputs.invoice;
      let promo_code = inputs.promo_code;
      let discounted_total = 0;
      sails.log(invoice);
      switch (promo_code.apply_on) {
        case global.PROMO_APPLY_ON.SUBTOTAL: {
          let subtotal = _.find(invoice.bill, {
            key: global.PROMO_APPLY_ON.SUBTOTAL,
          });
          let subtotal_discounted = _.find(invoice.bill, {
            key: "subtotal_discounted",
          });
          //if (result.rows.length)
          {
            discounted_total = (subtotal.value * promo_code.discount) / 100;
            discounted_total = getMaxDiscount(promo_code, discounted_total);
            subtotal_discounted.value -= discounted_total;
          }
          sails.log({
            //resultRows: result.rows[0],
            discounted_total: discounted_total,
            promo_codeDiscount: promo_code.discount,
          });

          break;
        }
        case global.PROMO_APPLY_ON.TOTAL: {
          discounted_total = (invoice.total.value * promo_code.discount) / 100;
          discounted_total = getMaxDiscount(promo_code, discounted_total);
          invoice.total.value -= discounted_total;

          break;
        }
        case global.PROMO_APPLY_ON.WASPHA_FEE: {
          let waspha_fee = _.find(invoice.bill, {
            key: global.PROMO_APPLY_ON.WASPHA_FEE,
          });

          discounted_total = (waspha_fee.value * promo_code.discount) / 100;
          discounted_total = getMaxDiscount(promo_code, discounted_total);
          waspha_fee.value -= discounted_total;
          break;
        }
        case global.PROMO_APPLY_ON.DELIVERY_FEE: {
          let delivery_fee = _.find(invoice.bill, {
            key: global.PROMO_APPLY_ON.DELIVERY_FEE,
          });
          discounted_total = (delivery_fee.value * promo_code.discount) / 100;
          discounted_total = getMaxDiscount(promo_code, discounted_total);
          delivery_fee.value -= discounted_total;
          break;
        }
      }

      invoice.total.value = invoice.total.value - discounted_total;
      invoice.total.value = parseFloat(invoice.total.value.toFixed(2));
      invoice.total.discounted_value = discounted_total;

      return exits.success(invoice);
    } catch (err) {
      sails.log.error(`Error in helper modify-invoice. ${err}`);
    }
  },
};
