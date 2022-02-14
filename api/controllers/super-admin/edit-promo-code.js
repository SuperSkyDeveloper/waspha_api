const moment = require("moment");
module.exports = {
  friendlyName: "Edit promo code",

  description: "",

  inputs: {
    vendor_id: {
      type: "json",
      required: false,
    },
    user_id: {
      type: "json",
      required: false,
    },
    category_id: {
      type: "number",
      required: false,
      allowNull:true
    },
    subcategory_id: {
      type: "number",
      required: false,
      allowNull:true
    },
    promo_code: {
      type: "string",
      required: true,
    },
    country_id: {
      type: "number",
      required: true,
    },
    is_requested: {
      type: "boolean",
      required: false,
    },
    discount: {
      type: "number",
      required: true,
    },
    discount_type: {
      type: "string",
      required: false,
      defaultsTo: "percentage",
    },
    description: {
      type: "ref",
      required: false,
    },
    image: {
      type: "ref",
      required: false,
    },
    start_time: {
      type: "ref",
      columnType: "datetime",
      required: false,
    },
    end_time: {
      type: "ref",
      columnType: "datetime",
      required: false,
    },
    min_order_amount: {
      type: "number",
      required: false,
    },
    max_discount: {
      type: "number",
      required: false,
    },
    number_of_uses: {
      type: "number",
      required: false,
    },
    payment_methods: {
      type: "json",
      required: false,
    },
    service_modes: {
      type: "json",
      required: false,
    },
    apply_on: {
      type: "string",
      required: false,
      defaultsTo: global.PROMO_APPLY_ON.SUBTOTAL,
    },
    pm_all:{
      type:'boolean',
      required:true
    },
    sm_all:{
      type:'boolean',
      required:true
    }
  },

  exits: {
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
    invalidRequest: {
      description: "Send invalidRequest response",
      responseType: "invalidRequest",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action super-admin/edit-promo-code");
    let temp = inputs;
    delete temp.image;
    sails.log(temp);
    let promo_code = await Promo_code.find({
      promo_code: inputs.promo_code.toUpperCase(),
    }).limit(1);
    if (!promo_code.length) {
      return exits.invalidRequest({
        status: false,
        message: "Promo code does not exist",
        data: null,
      });
    }
    promo_code = promo_code[0];
    let rec = {};

    rec.category_id = inputs.category_id || null;
    rec.subcategory_id = inputs.subcategory_id || null;
    rec.is_requested = inputs.is_requested;
    rec.promo_code = inputs.promo_code.toUpperCase();
    rec.country_id = inputs.country_id;
    if (inputs.description) {
      rec.description = JSON.stringify(inputs.description);
    }

    rec.start_time = moment(inputs.start_time).format("YYYY-MM-DD HH:mm:ss");
    rec.end_time = moment(inputs.end_time).format("YYYY-MM-DD HH:mm:ss");
    rec.min_order_amount = inputs.min_order_amount;
    rec.discount = inputs.discount;
    rec.max_discount = inputs.max_discount;
    rec.number_of_uses = inputs.number_of_uses;
    if(inputs.pm_all == true){
      rec.payment_methods = `${global.PAYMENT_METHOD.WALLET},${global.PAYMENT_METHOD.CARD},${global.PAYMENT_METHOD.CASH_ON_DELIVERY}`
    }else{
      if (inputs.payment_methods) {
        rec.payment_methods = inputs.payment_methods.join(",");
      }
    }    
    if(inputs.sm_all == true){
      rec.service_modes = `${global.RFP_TYPE.DELIVERY},${global.RFP_TYPE.PICKUP}`
    }else{       
      if (inputs.service_modes) {
        rec.service_modes = inputs.service_modes.join(",");
      }
    }    
    rec.apply_on = inputs.apply_on;

    if (inputs.image) {
      if (inputs.image.en) {
        is_valid_url = await sails.helpers.isValidUrl(inputs.image.en);
        if (is_valid_url === false) {
          inputs.image.en = await sails.helpers.aws.uploadFile(
            inputs.image.en,
            "promo-codes"
          );
        } else {
          inputs.image.en = inputs.image.en;
        }
      }
      if (inputs.image.ar) {
        is_valid_url = await sails.helpers.isValidUrl(inputs.image.ar);
        if (is_valid_url === false) {
          inputs.image.ar = await sails.helpers.aws.uploadFile(
            inputs.image.ar,
            "promo-codes"
          );
        } else {
          inputs.image.ar = inputs.image.ar;
        }
      }
      rec.image = JSON.stringify(inputs.image);
    }

    try {
      //let promo_code = await Promo_code.create(rec).fetch();
       promo_code = await Promo_code.updateOne({id: promo_code.id}).set(rec);
      if (promo_code) {
        await Promo_code_restricted_vendor.destroy({promo_code_id:promo_code.id})
        if (inputs.vendor_id) {
          let restricted_vendors = [];
          for (id of inputs.vendor_id) {
            let obj = {};
            obj.promo_code_id = promo_code.id;
            obj.vendor_id = id;
            restricted_vendors.push(obj);
          }
          await Promo_code_restricted_vendor.createEach(
            restricted_vendors
          ).exec(function createCB(err, created) {
            if (err) {
              sails.log.error(
                `error in attaching restricted vendors to promo code,Error: ${err}`
              );
            }
            sails.log("restricted vendor(s) attached to promo code", created);
          });
        }

      await Promo_code_restricted_user.destroy({promo_code_id:promo_code.id})
        if (inputs.user_id) {
          let restricted_users = [];
          for (id of inputs.user_id) {
            let obj = {};
            obj.promo_code_id = promo_code.id;
            obj.user_id = id;
            restricted_users.push(obj);
          }
          await Promo_code_restricted_user.createEach(restricted_users).exec(
            function createCB(err, created) {
              if (err) {
                sails.log.error(
                  `error in attaching restricted users to promo code,Error: ${err}`
                );
              }
              sails.log("restricted user(s) attached to promo code", created);
            }
          );
        }
      }

      return exits.success({
        status: true,
        message: "Updated successfully",
        data: promo_code,
      });
    } catch (err) {
      sails.log.error(`Error in action super-admin/edit-promo-code. ${err}`);
      return exits.ok({
        status: false,
        message: "Unable to create",
      });
    }
  },
};
