module.exports = {
  friendlyName: "Add waspha country",

  description: "",

  inputs: {
    country_id: {
      type: "number",
      required: false,
    },
  },

  exits: {
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
    invalidRequest: {
      description: "Send invalidRequest response",
      responseType: "invalidRequest",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action super-admin/add-waspha-country");

    let exist = await Waspha_country.find({
      country_id: inputs.country_id,
    }).limit(1);
    if (exist.length) {
      return exits.invalidRequest({
        status: false,
        message: "Waspha country already exist",
        data: null,
      });
    }

    try {
      let waspha_country = await Waspha_country.create(inputs).fetch();

      return exits.success({
        status: true,
        message: "Created successfully",
        data: waspha_country,
      });
    } catch (err) {
      sails.log(`Error in action super-admin/add-waspha-country. ${err}`);
      return exits.ok({
        status: false,
        message: "Unable to create",
      });
    }
  },
};
