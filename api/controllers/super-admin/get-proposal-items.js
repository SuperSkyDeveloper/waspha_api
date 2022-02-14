module.exports = {
  friendlyName: "Get rfp items",

  description: "",

  inputs: {
    id: {
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
    notFound: {
      description: "Send notFound response",
      responseType: "notFound",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action super-admin/get-proposal-items");
    try {
      let req = this.req;
      sails.log({ query: req.query });
      let range = [0, 9];
      if (req.query.range) {
        range = JSON.parse(req.query.range);
      }
      var sort = await sails.helpers.getSortFilters(req);
      sails.log({ sort: sort });
      let where = {};
      if (req.query.filter) {
        let filter = JSON.parse(req.query.filter);
        if (filter.order_id) {
          where.proposal_id = filter.order_id;
        }
      }
      let items = await Proposal_item.find({
        where: where,
      })
        .skip(range[0])
        .limit(range[1] + 1)
        .sort(sort);

      if (items.length) {
        // items[0].total = await Request_for_proposal_item.count(where);
        items[0].total = items.length;
        return exits.success({
          status: true,
          data: items,
        });
      }
      return exits.notFound({
        status: false,
        data: [],
      });
    } catch (err) {
      sails.log.error(`Error in action super-admin/get-rfp-items. ${err}`);
      return exits.notFound({
        status: false,
        data: [],
      });
    }
  },
};
