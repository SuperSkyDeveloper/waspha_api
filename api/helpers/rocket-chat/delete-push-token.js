module.exports = {
  friendlyName: "Delete push token",

  description: "Delete rocket chat user push token",

  inputs: {
    rc_id: {
      type: "string",
      required: true,
    },
    rc_auth_token: {
      type: "string",
      required: true,
    },
    token: {
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
    sails.log("calling helper rocket-chat/delete-push-token");

    let data = false;

    let postfields = {
      token: inputs.token,
    };
    header = {
      "x-auth-token": inputs.rc_auth_token,
      "x-user-id": inputs.rc_id,
    };

    let url = process.env.ROCKET_CHAT_URL + "/push.token";
    let res = await sails.helpers.request.invoke(
      url,
      "DELETE",
      postfields,
      header
    );
    console.log({
      postfields: postfields,
      header: header,
      resInDeletePushToken: res,
    });
    if (!_.isUndefined(res.body.success) && res.body.success === true) {
      data = true;
    }

    // console.log({ data111: data });
    return exits.success(data);
  },
};
