const moment = require("moment");

function pluck(array, key) {
  return array.map((o) => o[key]);
}

module.exports = {
  friendlyName: "Request for proposals",

  description: "",

  inputs: {
    vendor: {
      type: "ref",
      required: true,
      description: "logged in vendor",
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
    sails.log("calling action vendor/rfp-listing");
    const strings = sails.config.strings[inputs.vendor.language];
    var data = [];

    const statuses = await sails.helpers.getAllStatuses();
    // var attachedRfps = await sails.models.request_for_proposal_store.find({
    //   where:{
    //     store_id: inputs.vendor.store.id,
    //     status_id: statuses.pending
    // },
    // select: ['rfp_id','createdAt']
    // });
    // const rfpIds = pluck(attachedRfps,'rfp_id')
    // var query = await sails.models.request_for_proposal
    // .find({
    //   where: {id: rfpIds},
    //   select: ['id','createdAt']
    // })
    // .sort('createdAt DESC');

    var q = `
    SELECT  rfp.id as rfp_id,rfp_store.createdAt AS order_date,rfp.delivery_location,rfp.type,u.name as user_name,
    (SELECT i.id FROM request_for_proposal_items i 
      INNER JOIN menu_promotions mp
       ON mp.product_id = i.product_id
      WHERE rfp_id = rfp.id 
     AND mp.expiry_time > NOW()
      LIMIT 1) AS menu_promotion
    FROM request_for_proposals rfp
    INNER JOIN request_for_proposal_store rfp_store
      ON rfp_store.rfp_id = rfp.id
    INNER JOIN users u
      ON rfp.user_id = u.id
    LEFT JOIN proposals p ON p.rfp_store_id = rfp_store.id
    WHERE rfp_store.store_id = ${inputs.vendor.store.id}
    AND rfp_store.status_id = ${statuses.pending}
    AND rfp.status_id NOT IN(${statuses.expired},${statuses.cancelled},${statuses.rejected},${statuses.deleted},${statuses.closed})
    AND (p.id IS NULL OR p.status_id IS NULL)
    ORDER BY rfp_store.createdAt DESC
    `;
    var result = await sails.sendNativeQuery(q);
    var records = [];
    if (!result.rows.length) {
      return exits.ok({
        status: true,
        data: data,
        message: strings.NOT_FOUND,
      });
    }
    const expiry_minutes = process.env.EXPIRY_TIME_RFP;
    console.log("query:", inputs.vendor.language);
    // result.rows.forEach(function(rfp){
    for (rfp of result.rows) {
      var temp = {};
      temp["id"] = rfp.rfp_id;
      temp["order_date"] = rfp.order_date;
      temp["type"] = rfp.type;
      temp["description"] = await sails.helpers.getRfpDescription(
        rfp,
        inputs.vendor.language
      );
      temp["expiry_time"] = moment(rfp.order_date).add(
        expiry_minutes,
        "minutes"
      ); //rfp.order_date;
      temp["is_featured"] = rfp.menu_promotion ? true : false;
      console.log(moment().utc());
      if (temp["expiry_time"].isAfter(moment())) {
        records.push(temp);
      }
    }

    // });

    data = records;
    // sails.log({
    //   dataLength: data.length,
    //   recLength: records.length,
    //   rows: result.rows,
    // });
    if (data.length > 0) {
      return exits.success({
        status: true,
        message: strings.FOUND,
        data: data,
      });
    }
    return exits.ok({
      status: true,
      data: data,
      message: strings.NOT_FOUND,
    });
  },
};
