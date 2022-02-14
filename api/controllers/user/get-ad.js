module.exports = {
  friendlyName: "Get ad",

  description: "",

  inputs: {
    user: {
      type: "ref",
      required: true,
      description: "logged in user",
    },
    location: {
      type: "json",
      required: true,
      custom: function (value) {
        return (
          _.isObject(value) &&
          //  && typeof value.address !== 'undefined'
          typeof value.lat !== "undefined" &&
          typeof value.lng !== "undefined" &&
          // && _.isString(value.address)
          _.isNumber(value.lat) &&
          _.isNumber(value.lng)
        );
      },
    },
  },

  exits: {
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("action user/get-ad started");
    const strings = sails.config.strings[inputs.user.language];
    let data = null;
    let message = strings.NOT_FOUND;
    let status = false;
    try {
      //6371 for km,3959 for miles
      let lat = inputs.location.lat;
      let lng = inputs.location.lng;
      let query = `
      SELECT
      id, (
         (6371 * ACOS (
           COS ( RADIANS(JSON_EXTRACT(location,'$.lng') ) )
           * COS( RADIANS( ${lat} ) )
           * COS( RADIANS( ${lng} ) - RADIANS(JSON_EXTRACT(location,'$.lat') ) )
           + SIN ( RADIANS(JSON_EXTRACT(location,'$.lng') ) )
           * SIN( RADIANS( ${lat} ) )
         ))/1000
       )AS distance,deletedAt,is_requested,radius,media,description,start_time,end_time,category_id,subcategory_id,service_modes
     FROM ads
     HAVING distance < radius
     AND deletedAt IS NULL
     AND NOW() BETWEEN start_time AND end_time
     ORDER BY distance ASC
     LIMIT 1;
     
      `;
      let result = await sails.sendNativeQuery(query);
      if (!result.rows.length) {
        return exits.ok({
          status: status,
          message: message,
        });
      }
      data = result.rows[0];
      if (await sails.helpers.isJsonString(data.media)) {
        data.media = JSON.parse(data.media);
      }
      if (await sails.helpers.isJsonString(data.description)) {
        data.description = JSON.parse(data.description);
      }
      delete data.radius;
      message = strings.FOUND;
      status = true;
    } catch (err) {
      sails.log(`Error in action user/get-ad. ${err}`);
    }
    sails.log("action user/get-ad ended");
    return exits.success({
      status: status,
      message: message,
      data: data,
    });
  },
};
