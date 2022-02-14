module.exports = {
  friendlyName: "Store quick info",

  description: "",

  inputs: {
    user: {
      type: "ref",
      required: true,
      description: "logged in user",
    },
    store_id: {
      type: "number",
      required: true,
    },
  },

  exits: {
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
    serverError: {
      description: "send server error",
      responseType: "serverError",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action user/store-quick-info");
    const strings = sails.config.strings[inputs.user.language];
    try {
      const store = await Store.find({
        where: { id: inputs.store_id },
        select: ["id", "business_name", "image"],
      });
      if (store.length) {
        store.average_rating = await Store_review_rating.avg("rating").where({
          store_id: store.id,
        });
        return exits.success({
          status: true,
          message: strings.FOUND,
          data: store,
        });
      }
      return exits.ok({
        status: true,
        message: strings.NOT_FOUND,
        data: [],
      });
    } catch (err) {
      sails.log.error(
        `Error getting store quick info,store id: ${inputs.store_id}, Error: ${err}`
      );
      return exits.serverError({
        status: false,
        message: strings.NOT_FOUND,
        data: [],
      });
    }
  },
};
