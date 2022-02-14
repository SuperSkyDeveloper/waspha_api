module.exports = {
  friendlyName: "Get proposal",

  description: "",

  inputs: {
    admin: {
      type: "ref",
      required: true,
      description: "logged in admin",
    },
    id: {
      type: "number",
      required: true,
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
    notFound: {
      description: "Send notFound response",
      responseType: "notFound",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action super-admin/get-proposal");
    sails.log({ inputs: inputs });
    var statuses = await sails.helpers.getAllStatuses();
    let proposal = await Proposal.findOne({ id: inputs.id })
      .populate("rfp_store_id")
      .populate("status_id")
      .populate("delivery_mode_id")
      .populate("delivery_vehicle_id")
      .populate("items");

    sails.log({ proposal: proposal });
    if (proposal) {
      let rfp = await Request_for_proposal.findOne({
        id: proposal.rfp_store_id.rfp_id,
      })
        .populate("subcategory_id")
        .populate("user_id");
      let store = await Store.findOne({
        id: proposal.rfp_store_id.store_id,
      }).populate("vendor_id");
      // sails.log({ rfp: rfp });
      proposal.rfp_time = proposal.rfp_store_id.createdAt;

      proposal.category = {};
      proposal.category.name = {
        en: rfp.subcategory_id.en,
        ar: rfp.subcategory_id.ar,
      };

      proposal.delivery_mode_id.title = {
        en: proposal.delivery_mode_id.title,
        ar: proposal.delivery_mode_id.title_ar,
      };
      proposal.delivery_mode_id.subtitle = {
        en: proposal.delivery_mode_id.subtitle,
        ar: proposal.delivery_mode_id.subtitle_ar,
      };
      proposal.delivery_vehicle_id.title = {
        en: proposal.delivery_vehicle_id.title,
        ar: proposal.delivery_vehicle_id.title_ar,
      };
      proposal.delivery_vehicle_id.subtitle = {
        en: proposal.delivery_vehicle_id.subtitle,
        ar: proposal.delivery_vehicle_id.subtitle_ar,
      };

      proposal.user = {};
      proposal.user.id = rfp.user_id.id;
      proposal.user.name = rfp.user_id.name;
      proposal.vendor = {};
      proposal.vendor.id = store.id;
      proposal.vendor.name = await sails.helpers.convertHtmlIntoText(
        store.business_name
      );

      proposal.driver = {};
      query = `
      SELECT d.* FROM drivers d
      INNER JOIN proposal_driver pd
        ON pd.driver_id = d.id
      WHERE 
        pd.proposal_id = ${proposal.id}
        AND 
        (pd.status_id IN (${statuses.pending},${statuses.accepted},${statuses.completed},${statuses.at_pickup},${statuses.picked_up},${statuses.delivery_started},
          ${statuses.at_delivery},${statuses.delivery_confirmed},${statuses.payment_received})
          OR d.type = '${global.DRIVER_TYPE.OFFLINE}'
        )       
        ORDER BY pd.createdAt DESC
        LIMIT 1`;
      result = await sails.sendNativeQuery(query);
      if (result.rows.length) {
        let assigned_driver = result.rows[0];
        proposal.driver.name = assigned_driver.name;
      }
      proposal.status = proposal.status_id.description;
      proposal.invoice = await sails.helpers.getProposalInvoice.with({
        proposal_id: proposal.id,
        language: inputs.admin.language,
      });
      sails.log({ total12121: proposal.invoice.total });
      proposal.invoice.total = {
        id: 7,
        key: "total",
        label: proposal.invoice.total.label,
        value: proposal.invoice.total.value,
      };
      proposal.invoice.bill.push(proposal.invoice.total);
      delete proposal.invoice.total;
      delete proposal.status_id;
      return exits.success({
        status: true,
        message: "proposal found successfully",
        data: proposal,
      });
    }
    return exits.notFound({
      status: false,
      message: "Not found",
      data: [],
    });
  },
};
