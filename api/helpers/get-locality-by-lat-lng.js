module.exports = {
  friendlyName: "Get locality by lat lng",

  description: "",

  inputs: {
    lat: {
      type: "number",
      required: true,
    },
    lng: {
      type: "number",
      required: true,
    },
  },

  exits: {
    success: {
      outputFriendlyName: "Locality by lat lng",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper get-locality-by-lat-lng");
    let locality = null;
    try {
      url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${inputs.lat},${inputs.lng}&sensor=false&key=${sails.config.google.api_key}`;

      let res = await sails.helpers.request.invoke(url, "GET");
      //sails.log({ url: url, resaaaaa: res });
      locality = _.find(res.body.results[0].address_components, {
        types: ["locality", "political"],
      });
      return exits.success(locality);
    } catch (err) {
      sails.log.error(`Error in helper get-locality-by-lat-lng. ${err}`);
      return exits.success(locality);
    }
  },
};
