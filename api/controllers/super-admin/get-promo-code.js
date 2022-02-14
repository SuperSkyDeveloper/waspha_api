module.exports = {
  friendlyName: "Get promo code",

  description: "",

  inputs: {
    id: {
      type: "number",
      required: true,
    },
  },

  exits: {
    notFound: {
      responseType: "notFound",
      description: "Send notFound response",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action admin/get-promo-code");
    const promo_code = await Promo_code.findOne({
      where: { id: inputs.id, deletedAt: null },
      select: [
        "id",
        "promo_code",
        "discount",
        "start_time",
        "end_time",
        "country_id",
        "is_requested",
        "category_id",
        "subcategory_id",
        "apply_on",
        "description",
        "image",
        "min_order_amount",
        "max_discount",
        "number_of_uses",
        "payment_methods",
        "service_modes",
      ],
    });
    if (promo_code) {
      if(promo_code.image){
        promo_code.image = JSON.parse(promo_code.image)
      }
      if(promo_code.description){
        promo_code.description = JSON.parse(promo_code.description)
      }
      promo_code.sm_all = false
      if(promo_code.service_modes){
        promo_code.service_modes = promo_code.service_modes.split(',');
        if(promo_code.service_modes.length == 2){
          promo_code.sm_all = true;
        }      
      }
      promo_code.pm_all = false
      if(promo_code.payment_methods){
        promo_code.payment_methods = promo_code.payment_methods.split(',');
         if(promo_code.payment_methods.length == 3){
          promo_code.pm_all = true;
        }     
      }
      let restricted_vendors = await Promo_code_restricted_vendor.find({promo_code_id: promo_code.id});
      if(restricted_vendors.length){
        promo_code.vendor_id = _.map(restricted_vendors,'vendor_id');
      }
      let restricted_users = await Promo_code_restricted_user.find({promo_code_id: promo_code.id});
      if(restricted_users.length){
        promo_code.user_id = _.map(restricted_users,'user_id');
      }
      return exits.success({
        status: true,
        message: "promo code found successfully",
        data: promo_code,
      });
    }
    return exits.notFound({
      status: false,
      message: "Not found",
      data: [],
    });
  },
};
