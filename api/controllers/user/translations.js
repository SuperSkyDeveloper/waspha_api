module.exports = {
  friendlyName: "Translations",

  description: "Translations user.",

  inputs: {},

  exits: {},

  fn: async function (inputs, exits) {
    sails.log("calling action user/translations");
    return exits.success({
      status: true,
      data: await sails.helpers.general.getTranslations(global.ROLE.USER),
    });
  },
};
