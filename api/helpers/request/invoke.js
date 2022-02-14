const request = require("request");
module.exports = {
  friendlyName: "Invoke",

  description: "Invoke curl.",

  inputs: {
    url: {
      type: "string",
      required: true,
    },
    method: {
      type: "string",
      required: true,
    },
    postfields: {
      type: "json",
      required: false,
    },
    headers: {
      type: "json",
      required: false,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper request/invoke");
    let data = { response: null, error: null, body: null };
    let req = {
      url: inputs.url,
      method: inputs.method,
      json: true, // <--Very important!!!
    };
    if (inputs.postfields) {
      req.body = inputs.postfields;
    }
    if (inputs.headers) {
      req.headers = inputs.headers;
    }
    //console.log({req: req});
    request(req, function (error, response, body) {
      //console.log({ response: response, error: error, body: body });
      data.error = error;
      data.response = response;
      data.body = body;
      return exits.success(data);
    });
  },
};
