module.exports = {
  friendlyName: "Get commission",

  description: "",

  inputs: {
    admin: {
      type: "ref",
      required: true,
      description: "Logged in admin",
    },
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
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action admin/get-commission");
    let where = { id: inputs.id };
    if (inputs.admin.role.name == global.ROLE.ADMIN) {
      where.country = inputs.admin.country.id;
    }
    const commission = await Waspha_commission.findOne({
      where: where,
      select: [
        "id",
        "waspha_fee_delivery",
        "waspha_fee_delivery_type",
        "waspha_fee_pickup",
        "waspha_fee_pickup_type",
      ],
    }).populate("country");
    if (commission) {
      return exits.success({
        status: true,
        message: "commission found successfully",
        data: commission,
      });
    }
    return exits.notFound({
      status: false,
      message: "Not found",
      data: [],
    });
  },
};
