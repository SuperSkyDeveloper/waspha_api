const { Sails } = require("sails");

module.exports = {
  friendlyName: "Upload file",

  description: "",

  inputs: {
    base64_image: {
      required: true,
      type: "string",
    },
    folder_name: {
      type: "string",
      defaultsTo: "vendor",
    },
    file_type: {
      type: "string",
      required: false,
      defaultsTo: "png",
    },
  },

  exits: {
    serverError: {
      description: "send server error",
      responseType: "serverError",
    },
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
  },

  fn: async function (inputs, exits) {
    //console.log(inputs);
    const output = await sails.helpers.aws.uploadFile(
      inputs.base64_image,
      inputs.folder_name,
      inputs.file_type
    );
    console.log(output);

    return exits.success({
      status: true,
      message: `File uploaded successfully`,
      data: {
        file_path: output,
      },
    });
  },
};
