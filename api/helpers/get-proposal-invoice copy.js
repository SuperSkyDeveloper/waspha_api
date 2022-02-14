module.exports = {
  friendlyName: "Get proposal invoice",

  description: "",

  inputs: {
    proposal_id: {
      type: "number",
    },
    items: {
      type: "json",
    },
    language: {
      type: "string",
      required: false,
    },
  },

  exits: {
    success: {
      outputFriendlyName: "Proposal invoice",
    },
  },

  fn: async function ({ proposal_id, items = null, language }, exits) {
    sails.log("calling helper vendor/get-proposal-invoice");
    let translations = {
      en: {
        subtotal: "Items subtotal",
        subtotal_discounted: "Items Discounted subtotal",
        delivery_fee: "Delivery Fee",
        waspha_fee_ratio: "Waspha Fee (Rate)",
        waspha_fee_fixed: "Waspha Fee (Fixed)",
        waspha_fee_type: "Waspha Fee Type",
        waspha_fee_amount: "Waspha Fee Amount",
        total: "Total amount to be paid",
      },
      ar: {
        subtotal: "المجموع الفرعي للعناصر",
        subtotal_discounted: "المجموع الفرعي للعناصر",
        delivery_fee: "رسوم التوصيل",
        waspha_fee_ratio: "رسوم الوصفة (معدل)",
        waspha_fee_fixed: "رسوم الوصفة (ثابتة)",
        waspha_fee_type: "نوع رسوم",
        waspha_fee_amount: "مبلغ رسوم الوصفة",
        total: "المبلغ الإجمالي الذي يتعين دفعه",
      },
    };

    const proposal = await sails.models.proposal.findOne({ id: proposal_id });

    data = [];
    if (proposal) {
      var items = await Proposal_item.find({
        proposal_id: proposal.id,
      }).populate("product_id");
      sails.log("calculating items subtotal");
      var wasphaFeeRatio = 0; //will be set from admin panel later

      var subtotal = 0;
      var discounted_subtotal = 0;

      let menu_promotions = await sails.helpers.getMenuPromotions();

      for (item of items) {
        //sails.log({ itemaaaa: item });
        let tax = (item.price * item.tax_ratio) / 100;
        let itemTotal = item.price * item.quantity + tax * item.quantity;
        let promotionTotal = 0;
        if (item.product_id) {
          item.title = {
            en: item.product_id.title,
            ar: item.product_id.title_ar,
          };
          item.description = {
            en: item.product_id.description,
            ar: item.product_id.description_ar,
          };
          item.image = {
            en: item.product_id.image,
            ar: item.product_id.image_ar,
          };

          item.menu_promotion = await sails.helpers.getMenuPromotion(
            item.product_id.id,
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
          item.product_id = item.product_id.id;
        }

        // sails.log({ itemTotal: itemTotal, promotionTotal: promotionTotal });
        subtotal += itemTotal;
        discounted_subtotal += itemTotal - promotionTotal;
      }
      proposal.items = items;
      //#region waspha commission
      let key =
        proposal.type == global.RFP_TYPE.DELIVERY
          ? "waspha_fee_delivery"
          : "waspha_fee_pickup";
      let setting = await sails.helpers.getSetting(key);
      let wasphaFee = 5;
      let wasphaFeeType = "percentage";
      if (setting.length) {
        wasphaFee = parseFloat(setting[0].value);
        let setting_type = await sails.helpers.getSetting(key + "_type");
        wasphaFeeType = setting_type[0].value;
      }
      var wasphaFeeAmount = wasphaFee;
      if (wasphaFeeType == "percentage") {
        wasphaFeeAmount = (subtotal * wasphaFee) / 100;
      }

      //#endregion
      var waitingToll = 10;
      let temp = {
        id: 1,
        key: "subtotal",
        //label: "Items subtotal",
        label: translations[language]["subtotal"],
        value: subtotal,
      };
      data.push(temp);
      temp = {
        id: 7,
        key: "subtotal_discounted",
        //label: "Items subtotal",
        label: translations[language]["subtotal_discounted"],
        value: discounted_subtotal,
      };
      data.push(temp);
      // temp = {id: 2, key:'discount_rate',label:'Discount (Rate)',value: 0};
      // data.push(temp);
      // temp = {id: 3, key:'discount_amount',label:'Discount Amount',value: 0};
      // data.push(temp);

      if (proposal.type == global.RFP_TYPE.DELIVERY) {
        temp = {
          id: 4,
          key: "delivery_fee",
          label: translations[language]["delivery_fee"],
          value: proposal.delivery_fee,
        };
        data.push(temp);
      }
      temp = {
        id: 5,
        key: "waspha_fee_ratio",
        label:
          wasphaFeeRatio > 0
            ? translations[language]["waspha_fee_ratio"]
            : translations[language]["waspha_fee_fixed"],
        value: wasphaFeeRatio > 0 ? wasphaFeeRatio : wasphaFeeAmount,
      };
      data.push(temp);

      temp = {
        id: 6,
        key: "waspha_fee_amount",
        label: translations[language]["waspha_fee_amount"],
        value: wasphaFeeAmount,
      };
      data.push(temp);
      // temp = {id: 7, key:'waiting_toll',label:'Waiting Toll /  Parking Ch.',value: waitingToll};
      // data.push(temp);

      var new_data = {};
      new_data["total"] = {
        label: translations[language]["total"],
        value: discounted_subtotal + wasphaFeeAmount,
      };
      new_data["waspha_fee_type"] = wasphaFeeType;
      if (proposal.type == global.RFP_TYPE.DELIVERY) {
        new_data["total"].value += proposal.delivery_fee;
      }
      new_data["bill"] = data;
      new_data["proposal"] = proposal;
      //sails.log({new_data_in_invoice: JSON.stringify(new_data)});
      return exits.success(new_data);
    }
  },
};
