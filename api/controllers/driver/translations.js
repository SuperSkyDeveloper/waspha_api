module.exports = {
  friendlyName: "Translations",

  description: "Translations driver.",

  inputs: {},

  exits: {},

  fn: async function (inputs, exits) {
    sails.log("calling action driver/translations");
    return exits.success({
      status: true,
      data: await sails.helpers.general.getTranslations(global.ROLE.DRIVER),
    });
  },
};
