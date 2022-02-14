const request = require("request");
module.exports = {
  friendlyName: "Login",

  description: "Login rocket chat.",

  inputs: {
    email: {
      type: "string",
      required: false,
    },
    password: {
      type: "string",
      required: false,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper rocket-chat/login");

    let data = {};
    let url = process.env.ROCKET_CHAT_URL + "/login";
    let obj = {
      user: inputs.email || process.env.ROCKET_CHAT_EMAIL,
      password: inputs.password || process.env.ROCKET_CHAT_PASSWORD,
    };
    let res = await sails.helpers.request.invoke(url, "POST", obj);
    console.log({ res_in_rc_login: res });
    if (!_.isUndefined(res.body.status) && res.body.status === "success") {
      data["rc_auth_token"] = res.body.data.authToken;
      data["rc_id"] = res.body.data.userId;
      data["rc_username"] = res.body.data.me.username;
    }
    return exits.success(data);
  },
};
