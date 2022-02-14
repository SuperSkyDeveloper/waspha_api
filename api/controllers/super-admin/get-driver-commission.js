module.exports = {
  friendlyName: "Get driver commission",

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
    sails.log("calling action admin/get-driver-commission");
    const commission = await Waspha_commission_driver.findOne({
      where: { id: inputs.id },
      select: [
        "id",
        "waspha_fee_normal",
        "waspha_fee_normal_type",
        "waspha_fee_traditional",
        "waspha_fee_traditional_type",
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
