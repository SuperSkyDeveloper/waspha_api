const moment = require("moment");
module.exports = {
  friendlyName: "Get promo codes",

  description: "",

  inputs: {
    id: {
      type: "number",
      required: true,
    },
    role: {
      type: "string",
      required: true,
    },
    type: {
      type: "string",
      required: false,
      allowNull: true,
      isIn: ["general", "specific"],
    },
  },

  exits: {
    success: {
      outputFriendlyName: "Promo codes",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper general/get-promo-codes");
    try {
      let promo_codes = [];
      var statuses = await sails.helpers.getAllStatuses();
      let result = null;
      let where = {
        deletedAt: null,
        //status_id: { "!=": statuses[global.STATUS.EXPIRED] },
        end_time: { ">": moment().format("YYYY-MM-DD HH:mm:ss") },
      };

      switch (inputs.role) {
        case global.ROLE.VENDOR: {
          let restricted = await Promo_code_restricted_vendor.find({
            vendor_id: inputs.id,
          }).populate("vendor_id");
          if (inputs.type) {
            if (inputs.type == "general") {
              where.is_requested = false;
            } else {
              if (restricted.length) {
                promo_ids = _.map(restricted, "promo_code_id");
                where.id = promo_ids;
              }
              //where.vendor_id = inputs.id;
            }
          } else {
            where.or = [{ is_requested: false }];
            if (restricted.length) {
              promo_ids = _.map(restricted, "promo_code_id");
              where.or.push({ id: promo_ids });
            }
          }
          break;
        }
        case global.ROLE.USER: {
          where.start_time = {
            "<=": moment().format("YYYY-MM-DD HH:mm:ss"),
          };

          if (inputs.type) {
            if (inputs.type == "general") {
              where.is_requested = false;
            } else {
              where.is_requested = true;
            }
          }
          break;
        }
        case global.ROLE.DRIVER: {
          break;
        }
      }
      sails.log({ where: where });

      promo_codes = await Promo_code.find({
        where: where,
        select: [
          "id",
          "start_time",
          "end_time",
          "number_of_uses",
          "promo_code",
          "discount",
          "is_requested",
        ],
      }).sort("createdAt DESC");

      if (promo_codes.length) {
        promo_ids = _.map(promo_codes, "id");
        let restricted_vendors = await Promo_code_restricted_vendor.find({
          promo_code_id: promo_ids,
        }).populate("vendor_id");

        for (pc of promo_codes) {
          pc.type = global.PROMO_CODE_TYPE.GENERAL;
          pc.vendor = null;
          if (pc.is_requested) {
            pc.type = global.PROMO_CODE_TYPE.SPECIFIC;
            if (restricted_vendors.length) {
              pc.vendor = {
                id: restricted_vendors[0].vendor_id.id,
                name: {
                  en: restricted_vendors[0].vendor_id.business_name,
                  ar: restricted_vendors[0].vendor_id.ar,
                },
                image: restricted_vendors[0].vendor_id.image,
              };
            }
          }
        }
      }
      return exits.success(promo_codes);
    } catch (err) {
      sails.log.error(`Error in helper general/get-promo-codes. ${err}`);
      return exits.success(promo_codes);
    }
  },
};
