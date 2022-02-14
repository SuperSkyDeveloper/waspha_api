/* eslint-disable max-depth */
/* eslint-disable no-lonely-if */
var axios = require("axios");

module.exports = {
  friendlyName: "Emit Event",

  description: "",

  inputs: {
    event: {
      type: "string",
      required: true,
      description:
        "This is the name of the event. Using this the dashboard will decide which model is to be changed",
    },
    obj: {
      type: "ref",
      required: true,
      description: "It is the data this needs to be emitted to the dashboard",
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    const cronJobID = 0;
    const token = await sails.helpers.realtime.token.with({
      userId: cronJobID,
    });
    const data = {};
    const url = `${sails.config.tracking.url}/emit-data`;
    data.secretKey = sails.config.tracking.secret;
    data.token = token;
    data.userId = cronJobID;
    data.event = inputs.event;
    data.emitData = inputs.obj;
    //data.businessId = inputs.businessId;

    sails.log("calling emit data helper"); // JSON.stringify(data)
    var body = await axios.post(url, data);
    if (!body.data.status) {
      sails.log.error("Unable to emit data to realtime server", body.data);
    }
    return exits.success(true);
  },
};
