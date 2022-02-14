const moment = require("moment");
async function makePaymentObject(invoice, user, ip = null, host = null) {
  let base_url = sails.config.custom.baseUrl;
  let return_url = `${sails.config.custom.returnUrl}/user/verify-payment`;
  let products = await getProducts(invoice.proposal.items);

  let delivery_fee = _.find(invoice.bill, function (o) {
    return o.key == "delivery_fee";
  });
  let other_amount = 0;
  if (delivery_fee) {
    other_amount += delivery_fee.value;
  }
  let waspha_fee = _.find(invoice.bill, function (o) {
    return o.key == "waspha_fee_amount";
  });
  if (waspha_fee) {
    other_amount += waspha_fee.value;
  }
  let billing = {
    currency: user.currency,
    address: "Kuwait Kuwait",
    city: "Al Ahmadi",
    state: "KW-AH ",
    postal_code: "60000",
    country: "KWT",
  };
  // let billing = {
  //   currency: "AED",
  //   address: "UAE UAE",
  //   city: "Dubai",
  //   state: "AE-DU ",
  //   postal_code: "00000",
  //   country: "ARE",
  // };

  let obj = {
    merchant_email: sails.config.paytabs.merchant_email,
    secret_key: sails.config.paytabs.secret_key,
    site_url: base_url,
    return_url: return_url,
    title: `Order #${invoice.proposal.id}`,
    cc_first_name: user.name,
    cc_last_name: user.name,
    cc_phone_number: user.country_code,
    phone_number: user.contact,
    email: user.email,
    products_per_title: products.title,
    unit_price: products.unit_price,
    quantity: products.quantity,
    other_charges: other_amount,
    amount: invoice.total.value,
    discount: 0,
    currency: billing.currency,
    reference_no: invoice.proposal.id,
    billing_address: billing.address,
    city: billing.city,
    state: billing.state,
    postal_code: billing.postal_code,
    country: billing.country,
    shipping_first_name: user.name,
    shipping_last_name: user.name,
    address_shipping: billing.address,
    state_shipping: billing.state,
    city_shipping: billing.city,
    postal_code_shipping: billing.postal_code,
    country_shipping: billing.country,
    msg_lang: user.language,
    ip_customer: ip, //Pass customer IP here
    ip_merchant: host, //Change this to your server IP
    cms_with_version: "Sails application 0.0.0",
  };
  return obj;
}
async function getProducts(items) {
  let menu_promotions = await sails.helpers.getMenuPromotions();
  let title = "";
  let quantity = "";
  let unit_price = "";
  for (item of items) {
    let tax = (item.price * item.tax_ratio) / 100;
    let promotionTotal = 0;
    sails.log({ item: item.product_id });
    if (item.product_id) {
      item.menu_promotion = await sails.helpers.getMenuPromotion(
        item.product_id,
        menu_promotions
      );
      if (item.menu_promotion) {
        if (
          !_.isUndefined(item.menu_promotion.extra_data) &&
          !_.isEmpty(item.menu_promotion.extra_data) &&
          !_.isUndefined(item.menu_promotion.extra_data.discount)
        ) {
          let ratioAmount =
            (item.price * item.menu_promotion.extra_data.discount) / 100;
          promotionTotal = ratioAmount * item.quantity;
        }
      }
    }
    /// temp = !_.isObject(item.title) ? item.title.en : item.title;
    title += `${"item"} || `;
    quantity += `${item.quantity} || `;
    unit_price += `${item.price + tax - promotionTotal} || `;
  }
  let products = {};
  products.title = await sails.helpers.trimString(title, "| ");
  products.quantity = await sails.helpers.trimString(quantity, "| ");
  products.unit_price = await sails.helpers.trimString(unit_price, "| ");
  console.log({ products: products, items: items });
  return products;
}
module.exports = {
  friendlyName: "Make payment",

  description: "",

  inputs: {
    user: {
      type: "ref",
      required: true,
      description: "logged in user",
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
      required: false,
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
    sails.log("calling action user/make-payment");
    try {
      const templates = await sails.helpers.getAllNotificationTemplates();
      const statuses = await sails.helpers.getAllStatuses();
      let template = await sails.helpers.getNotificationTemplate(
        sails.config.notification.type.PROPOSAL_ACCEPTED
      );
      let query = `      
        SELECT p.id,p.delivery_mode_id,rfp.id AS rfp_id,s.vendor_id,v.language AS v_language
        FROM proposals p
        INNER JOIN request_for_proposal_store rfp_store 
          ON p.rfp_store_id = rfp_store.id
        INNER JOIN stores s
          ON s.id = rfp_store.store_id        
        INNER JOIN vendors v
          ON v.id = s.vendor_id        
        INNER JOIN request_for_proposals rfp 
          ON rfp_store.rfp_id = rfp.id
        WHERE rfp.user_id = ${inputs.user.id}
        AND p.id = ${inputs.proposal_id}
        AND p.status_id = ${statuses.pending}
        `;
      let result = await sails.sendNativeQuery(query);
      if (!result.rows.length) {
        return exits.ok({
          status: false,
          message:
            sails.config.strings[inputs.user.language].INVALID_PROPOSAL_ID,
        });
      }

      if (!_.isUndefined(inputs.promo_code_id)) {
        let response = await sails.helpers.applyPromoCode(
          inputs.user,
          inputs.proposal_id,
          inputs.payment_method,
          inputs.promo_code_id
        );
        if (response.status == false) {
          return exits.ok({
            status: false,
            message: response.message,
          });
        }
      }
      let invoice = await sails.helpers.getProposalInvoice.with({
        proposal_id: inputs.proposal_id,
        language: inputs.user.language,
      });
      let vendor_id = result.rows[0].vendor_id;
      let promo_code_id = !_.isUndefined(inputs.promo_code_id)
        ? inputs.promo_code_id
        : null;
      switch (inputs.payment_method) {
        case global.PAYMENT_METHOD.WALLET: {
          if (inputs.user.wallet < invoice.total.value) {
            return exits.ok({
              status: false,
              message:
                sails.config.strings[inputs.user.language]
                  .YOU_DONT_HAVE_ENOUGH_CREDIT,
            });
          }
          var order_status = {
            proposal_id: inputs.proposal_id,
            order_accepted: moment().format("YYYY-MM-DD HH:mm:ss"),
          };
          await Order_status.updateOne({ proposal_id: inputs.proposal_id }).set(
            order_status
          );
          await Request_for_proposal.updateOne({
            id: result.rows[0].rfp_id,
          }).set({ status_id: statuses.upcoming });

          proposal = await Proposal.updateOne({ id: inputs.proposal_id }).set({
            status_id: statuses.accepted,
            payment_method: global.PAYMENT_METHOD.WALLET,
            promo_code_id: promo_code_id,
          });
          let updated_wallet = parseFloat(
            (inputs.user.wallet - invoice.total.value).toFixed(2)
          );
          await User.updateOne({ id: inputs.user.id }).set({
            wallet: updated_wallet,
          });
          let title = template.meta[result.rows[0].v_language];
          let body = template[result.rows[0].v_language]
            .replace("{proposal_id}", inputs.proposal_id)
            .replace("{user}", inputs.user.name);
          extra_data = JSON.stringify({
            id: inputs.proposal_id || null,
            delivery_mode_id: proposal.delivery_mode_id,
            sent_by: {
              name: inputs.user.name,
              avatar: inputs.user.avatar || null,
            },
          });

          await sails.helpers.sendPushNotification(
            vendor_id,
            global.ROLE.VENDOR,
            title,
            body,
            false,
            extra_data,
            sails.config.notification.type.PROPOSAL_ACCEPTED
          );
          await sails.helpers.general.addNotification(
            vendor_id,
            global.ROLE.VENDOR,
            title,
            body,
            extra_data,
            sails.config.notification.type.PROPOSAL_ACCEPTED,
            templates[sails.config.notification.type.PROPOSAL_ACCEPTED]
          );
          return exits.success({
            status: true,
            message: sails.config.strings[inputs.user.language].PAID,
            data: { wallet: updated_wallet },
          });
        }
        case global.PAYMENT_METHOD.CASH_ON_DELIVERY: {
          var order_status = {
            proposal_id: inputs.proposal_id,
            order_accepted: moment().format("YYYY-MM-DD HH:mm:ss"),
          };
          await Order_status.updateOne({ proposal_id: inputs.proposal_id }).set(
            order_status
          );
          await Request_for_proposal.updateOne({
            id: result.rows[0].rfp_id,
          }).set({ status_id: statuses.upcoming });
          proposal = await Proposal.updateOne({ id: inputs.proposal_id }).set({
            status_id: statuses.accepted,
            payment_method: global.PAYMENT_METHOD.CASH_ON_DELIVERY,
            promo_code_id: promo_code_id,
          });
          if (proposal.delivery_mode_id == 3) {
            ///waspha_express delivery mode,assign rider to this order
            await sails.helpers.assignDriverToOrder(
              proposal.id,
              proposal.delivery_vehicle_id
            );
          }

          let title = template.meta[result.rows[0].v_language];
          let body = template[result.rows[0].v_language]
            .replace("{proposal_id}", inputs.proposal_id)
            .replace("{user}", inputs.user.name);
          extra_data = JSON.stringify({
            id: inputs.proposal_id || null,
            delivery_mode_id: proposal.delivery_mode_id,
            sent_by: {
              name: inputs.user.name,
              avatar: inputs.user.avatar || null,
            },
          });

          await sails.helpers.sendPushNotification(
            vendor_id,
            global.ROLE.VENDOR,
            title,
            body,
            false,
            extra_data,
            sails.config.notification.type.PROPOSAL_ACCEPTED
          );
          await sails.helpers.general.addNotification(
            vendor_id,
            global.ROLE.VENDOR,
            title,
            body,
            extra_data,
            sails.config.notification.type.PROPOSAL_ACCEPTED,
            templates[sails.config.notification.type.PROPOSAL_ACCEPTED]
          );
          return exits.success({
            status: true,
            message:
              sails.config.strings[inputs.user.language].PROCESSED_SUCCESSFULLY,
            data: [],
          });
        }
        case global.PAYMENT_METHOD.CARD: {
          //let proposal = await Proposal.findOne({id: inputs.proposal_id}).populate('items');
          inputs.user.currency = await sails.helpers.general.getCurrency(
            inputs.user.id,
            global.ROLE.USER
          );

          //return exits.success();
          let payment_object = await makePaymentObject(
            invoice,
            inputs.user,
            this.req.ip,
            this.req.hostname
          );
          let payment_response = await sails.helpers.paytabs.createPayPage(
            payment_object
          );
          if (!_.isUndefined(payment_response.body.tran_ref)) {
            return exits.success({
              status: true,
              message:
                sails.config.strings[inputs.user.language]
                  .PROCESSED_SUCCESSFULLY,
              data: { payment_url: payment_response.body.redirect_url },
            });
          } else {
            return exits.ok({
              status: false,
              message:
                sails.config.strings[inputs.user.language].UNABLE_TO_PROCESS,
              data: [],
            });
          }
        }
      }
    } catch (err) {
      sails.log.error(
        `Error in making payment for proposal id ${inputs.proposal_id}. ${err}`
      );
      return exits.ok({
        status: false,
        message: sails.config.strings[inputs.user.language].INVALID_PROPOSAL_ID,
      });
    }
  },
};
