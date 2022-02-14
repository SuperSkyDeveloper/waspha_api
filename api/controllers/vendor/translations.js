module.exports = {
  friendlyName: "Translations",

  description: "Translations vendor.",

  inputs: {},

  exits: {},

  fn: async function (inputs, exits) {
    sails.log("calling action vendor/translations");
    return exits.success({
      status: true,
      data: await sails.helpers.general.getTranslations(global.ROLE.VENDOR),
    });
  },
};
