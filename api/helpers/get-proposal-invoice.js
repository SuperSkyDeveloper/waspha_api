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
    sails.log("helper vendor/get-proposal-invoice started");
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
        estimate_delivery_fee: "Estimate Delivery Fee",
        package_charges: "Package Charges",
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
        estimate_delivery_fee: "تقدير رسوم التوصيل",
        package_charges: "رسوم الحزمة",
      },
    };

    try {
      const proposal = await sails.models.proposal
        .findOne({ id: proposal_id })
        .populate("rfp_store_id");

      data = [];
      if (proposal) {
        sails.log({ proposalSTroe: proposal });
        if (proposal.store_id) {
          store_id = proposal.store_id;
        } else {
          store_id = proposal.rfp_store_id.store_id;
        }
        var store = await Store.findOne({
          where: { id: store_id },
          select: [
            "waspha_fee_pickup",
            "waspha_fee_pickup_type",
            "waspha_fee_delivery",
            "waspha_fee_delivery_type",
          ],
        });
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

        let wasphaFeeVendor = store[`waspha_fee_${proposal.type}`];
        let wasphaFeeTypeVendor = store[`waspha_fee_${proposal.type}_type`];

        var wasphaFeeAmountVendor = wasphaFeeVendor;

        if (proposal.order_type == global.ORDER_TYPE.NORMAL) {
          var wasphaFeeObj = await sails.helpers.getWasphaFee(
            proposal.rfp_store_id.id,
            proposal.type
          );

          var wasphaFeeAmount = wasphaFeeObj.wasphaFee;
          if (wasphaFeeObj.wasphaFeeType == "percentage") {
            wasphaFeeRatio = wasphaFeeObj.wasphaFee;
            wasphaFeeAmount = (subtotal * wasphaFeeObj.wasphaFee) / 100;
          }
        }
        if (wasphaFeeTypeVendor == "percentage") {
          wasphaFeeAmountVendor = (subtotal * wasphaFeeVendor) / 100;
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
        if (proposal.order_type == global.ORDER_TYPE.TRADITIONAL) {
          temp.value = proposal.package_charges;
        }
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

        var estimate_delivery_fee = 0;
        if (proposal.delivery_mode_id == 3) {
          estimate_delivery_fee = proposal.delivery_fee;
          if (!estimate_delivery_fee) {
            estimate_delivery_fee = await sails.helpers.getProposalEstimateDeliveryFee(
              proposal.id
            );
          }

          temp = {
            id: 10,
            key: "estimate_delivery_fee",
            label: translations[language]["estimate_delivery_fee"],
            value: estimate_delivery_fee,
          };
          data.push(temp);
        } else {
          if (proposal.type == global.RFP_TYPE.DELIVERY) {
            temp = {
              id: 4,
              key: "delivery_fee",
              label: translations[language]["delivery_fee"],
              value: proposal.delivery_fee,
            };
            data.push(temp);
          }
        }

        if (proposal.order_type == global.ORDER_TYPE.NORMAL) {
          temp = {
            id: 5,
            key: "waspha_fee_user",
            label:
              wasphaFeeRatio > 0
                ? translations[language]["waspha_fee_ratio"]
                : translations[language]["waspha_fee_fixed"],
            value: wasphaFeeRatio > 0 ? wasphaFeeRatio : wasphaFeeAmount,
          };
          data.push(temp);

          temp = {
            id: 6,
            key: "waspha_fee_amount_user",
            label: translations[language]["waspha_fee_amount"],
            value: wasphaFeeAmount,
          };

          data.push(temp);
        }
        temp = {
          id: 8,
          key: "waspha_fee_vendor",
          label:
            wasphaFeeTypeVendor == "percentage"
              ? translations[language]["waspha_fee_ratio"]
              : translations[language]["waspha_fee_fixed"],
          value: wasphaFeeVendor,
        };
        data.push(temp);

        temp = {
          id: 9,
          key: "waspha_fee_amount_vendor",
          label: translations[language]["waspha_fee_amount"],
          value: wasphaFeeAmountVendor,
        };
        data.push(temp);
        // temp = {id: 7, key:'waiting_toll',label:'Waiting Toll /  Parking Ch.',value: waitingToll};
        // data.push(temp);

        if (proposal.order_type == global.ORDER_TYPE.TRADITIONAL) {
          temp = {
            id: 11,
            key: "package_charges",
            label: translations[language]["package_charges"],
            value: proposal.package_charges,
          };
          data.push(temp);
        }
        var new_data = {};
        value = discounted_subtotal || subtotal || proposal.package_charges;
        new_data["total"] = {
          label: translations[language]["total"],
          value: value + (wasphaFeeAmount || 0) + estimate_delivery_fee,
        };

        if (proposal.order_type == global.ORDER_TYPE.NORMAL) {
          new_data["waspha_fee_type_user"] = wasphaFeeObj.wasphaFeeType;
        }
        new_data["waspha_fee_type_vendor"] =
          store[`waspha_fee_${proposal.type}_type`];

        // if (proposal.type == global.RFP_TYPE.DELIVERY) {
        //   new_data["total"].value += proposal.delivery_fee;
        // }
        new_data["bill"] = data;
        new_data["proposal"] = proposal;
        //sails.log({new_data_in_invoice: JSON.stringify(new_data)});
        sails.log("helper vendor/get-proposal-invoice ended");
        return exits.success(new_data);
      }
    } catch (err) {
      sails.log.error(`Error in helper get-proposal-invoice. ${err}`);
      return exits.success(null);
    }
  },
};
