module.exports = {
  friendlyName: "Change keys",

  description: "",

  inputs: {
    data: {
      type: "json",
      required: true,
    },
    keys: {
      type: "ref",
      required: true,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper change-keys");
    try {
      let keys = inputs.keys;
      let result = inputs.data.map(function (o) {
        return _.mapKeys(o, function (v, k) {
          return k in keys ? keys[k] : k;
        });
      });

      return exits.success(result);
    } catch (err) {
      sails.log.error(`Error in helper change-keys. ${err}`);
      return exits.success([]);
    }
  },
};
