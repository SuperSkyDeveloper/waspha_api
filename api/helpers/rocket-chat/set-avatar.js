module.exports = {
  friendlyName: "Set avatar",

  description: "Set rocke chat user avatar",

  inputs: {
    rc_id: {
      type: "string",
      required: true,
    },
    rc_auth_token: {
      type: "string",
      required: true,
    },

    avatar: {
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
    sails.log("calling helper rocket-chat/set-avatar");

    let data = false;

    let postfields = {
      avatarUrl: inputs.avatar,
    };
    header = {
      "x-auth-token": inputs.rc_auth_token,
      "x-user-id": inputs.rc_id,
    };

    let url = process.env.ROCKET_CHAT_URL + "/users.setAvatar";
    let res = await sails.helpers.request.invoke(
      url,
      "POST",
      postfields,
      header
    );
    console.log({ resInSetAvatar: res });
    if (!_.isUndefined(res.body.success) && res.body.success === true) {
      data = true;
    }

    // console.log({ data111: data });
    return exits.success(data);
  },
};
