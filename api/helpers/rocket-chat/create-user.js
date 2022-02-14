const request = require("request");
module.exports = {
  friendlyName: "Create user",

  description: "Create user rocket chat.",

  inputs: {
    email: {
      type: "string",
      required: true,
    },
    name: {
      type: "string",
      required: true,
    },
    password: {
      type: "string",
      required: false,
      defaultsTo: "123456",
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper rocket-chat/create-user");

    let data = {};
    let admin = await sails.helpers.rocketChat.login(
      process.env.ROCKET_CHAT_EMAIL,
      process.env.ROCKET_CHAT_PASSWORD
    );
    if (!_.isUndefined(admin.rc_auth_token)) {
      let existing = await sails.helpers.rocketChat.findUserByEmail(
        inputs.email,
        { rc_auth_token: admin.rc_auth_token, rc_id: admin.rc_id }
      );
      if (!_.isUndefined(existing.rc_id)) {
        data = existing;
        return exits.success(data);
      }
      //let username = inputs.name.replace(/\s/g, "").toLowerCase();
      let username = inputs.email
        .toLowerCase()
        .substr(0, inputs.email.indexOf("@"));
      username += `_${await sails.helpers.generateRandomString(
        6,
        "abcdefghijklmnopqrstuvwxyz0123456789"
      )}`;
      sails.log({ username: username });

      let postfields = {
        email: inputs.email,
        name: await sails.helpers.convertHtmlIntoText(inputs.name),
        username: username,
        password: inputs.password,
      };
      sails.log({ postfieldsIncreateUser: postfields });
      header = {
        "x-auth-token": admin.rc_auth_token,
        "x-user-id": admin.rc_id,
      };

      let url = process.env.ROCKET_CHAT_URL + "/users.create";
      let res = await sails.helpers.request.invoke(
        url,
        "POST",
        postfields,
        header
      );
      // console.log({ res: res });
      if (!_.isUndefined(res.body.success) && res.body.success === true) {
        // console.log("res.body.user:", res.body.user);
        //data['rc_auth_token'] = res.body.data.authToken;
        data["rc_id"] = res.body.user._id;
        data["rc_username"] = res.body.user.username;
        data["rc_email"] = res.body.user.emails[0].address;
      }
    }
    // console.log({ data111: data });
    return exits.success(data);
  },
};
