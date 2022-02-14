module.exports = {
  friendlyName: "Get rfp",

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
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action admin/get-rfp");
    const rfp = await Request_for_proposal.findOne({ id: inputs.id })
      .populate("subcategory_id")
      .populate("user_id")
      .populate("status_id")
      .populate("items");

    if (!rfp) {
      return exits.ok({
        status: false,
        message: "rfp not found",
      });
    }
    if (inputs.admin.role.name == global.ROLE.ADMIN) {
      user_country = await sails.helpers.general.getCountry(
        rfp.user_id.id,
        global.ROLE.USER
      );
      if (user_country.id !== inputs.admin.country.id) {
        return exits.ok({
          status: false,
          message: "rfp not found",
        });
      }
    }
    rfp.items = await Request_for_proposal_item.find({
      where: { rfp_id: rfp.id },
      select: ["id", "name", "quantity", "additional_notes", "product_id"],
    }).populate("product_id");
    for (item of rfp.items) {
      item.name = {
        en: item.name,
        ar: item.name,
      };
      if (item.product_id) {
        item.name = {
          en: item.product_id.title,
          ar: item.product_id.title_ar,
        };
      }
    }
    rfp.category = {};
    rfp.category.name = {
      en: rfp.subcategory_id.en,
      ar: rfp.subcategory_id.ar,
    };

    delete rfp.subcategory_id;
    rfp.user = {};
    rfp.user.name = rfp.user_id.name;
    delete rfp.user_id;
    rfp.status = rfp.status_id.description;
    delete rfp.status_id;
    return exits.success({
      status: true,
      message: "rfp found successfully",
      data: rfp,
    });
  },
};
