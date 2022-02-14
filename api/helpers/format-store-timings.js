const strings = sails.config.strings;
module.exports = {
  friendlyName: "Format store timings",

  description: "",

  inputs: {
    timings: {
      type: "ref",
      required: true,
    },
    language: {
      type: "string",
      required: true,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper format-store-timings");
    var t = {};
    for (timing of inputs.timings) {
      if (_.isUndefined(t[timing.day])) {
        // console.log("yes:",t[timing.day]);
        t[strings[inputs.language].DAY[timing.day]] = [];
      }
      t[strings[inputs.language].DAY[timing.day]].push({
        [strings[inputs.language].FROM]: timing.from,
        [strings[inputs.language].TO]: timing.to,
      });
    }
    return exits.success(t);
  },
};
