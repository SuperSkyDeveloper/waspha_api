module.exports = {
  friendlyName: "Get addresses",

  description: "",

  inputs: {},

  exits: {
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
    notFound: {
      responseType: "notFound",
      description: "Send notFound response",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action super-admin/get-addresses");
    try {
      let req = this.req;
      let addresses = [];
      let range = [0, 9];
      if (req.query.range) {
        range = JSON.parse(req.query.range);
      }
      console.log("req.query:", req.query);
      let filter = null;
      if (req.query.filter) {
        filter = JSON.parse(req.query.filter);
        addresses = await User_address.find({
          where: { user_id: filter.user_id },
          select: ["id", "title", "phone", "landmark", "address"],
        });
        // .skip(range[0])
        // .limit(range[1] - range[0] + 1)
        // .sort(sort);
      }
      if (addresses.length) {
        addresses[0].total = addresses.length;
        return exits.success({
          status: true,
          message: "",
          data: addresses,
        });
      }
      return exits.ok({
        status: false,
        message: "Not found",
        data: [],
      });
    } catch (err) {
      sails.log.error(`Error in action super-admin/get-address. ${err}`);
      return exits.ok({
        status: false,
        message: "Not found",
        data: [],
      });
    }
  },
};
