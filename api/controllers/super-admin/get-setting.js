module.exports = {
  friendlyName: "Get setting",

  description: "",

  inputs: {
    id: {
      type: "number",
      required: true,
    },
  },

  exits: {
    notFound: {
      responseType: "notFound",
      description: "Send notFound response",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action admin/get-setting");
    const setting = await Setting.findOne({
      where: { id: inputs.id },
      select: ["id", "key", "display_name", "value"],
    });
    if (setting) {
      const type = await Setting.findOne({
        where: { key: setting.key + "_type" },
        select: ["key", "value"],
      });
      setting.type = type;
      return exits.success({
        status: true,
        message: "setting found successfully",
        data: setting,
      });
    }
    return exits.notFound({
      status: false,
      message: "Not found",
      data: [],
    });
  },
};
