module.exports = {
  friendlyName: "Save push token",

  description: "Save rocke chat user push token",

  inputs: {
    rc_id: {
      type: "string",
      required: true,
    },
    rc_auth_token: {
      type: "string",
      required: true,
    },

    type: {
      type: "string",
      required: true,
    },
    token: {
      type: "string",
      required: true,
    },
    app_name: {
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
    sails.log("calling helper rocket-chat/save-push-token");

    let data = false;

    let postfields = {
      type: inputs.type,
      value: inputs.token,
      appName: inputs.app_name,
    };
    header = {
      "x-auth-token": inputs.rc_auth_token,
      "x-user-id": inputs.rc_id,
    };

    let url = process.env.ROCKET_CHAT_URL + "/push.token";
    let res = await sails.helpers.request.invoke(
      url,
      "POST",
      postfields,
      header
    );
    console.log({
      postfields: postfields,
      header: header,
      resInSavePushToken: res,
    });
    if (!_.isUndefined(res.body.success) && res.body.success === true) {
      data = true;
    }

    // console.log({ data111: data });
    return exits.success(data);
  },
};
