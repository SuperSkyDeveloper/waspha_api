const moment = require("moment");

async function processQ(rfp, s_ids, initial_radius, radius_step, queue) {
  let title = null;
  let body = null;
  console.log("store_ids now:", s_ids);
  const statuses = await sails.helpers.getAllStatuses();

  query = `
  SELECT DISTINCT(s.id), s.vendor_id,
  ROUND(ST_DISTANCE_SPHERE(s.location_coordinates, ST_GEOMFROMTEXT('POINT(${rfp.lng} ${rfp.lat})'))/1000) AS distance
  FROM stores s
  LEFT JOIN store_subcategory sc
    ON sc.store_id = s.id
  WHERE EXISTS (SELECT subcategory_id FROM store_subcategory WHERE subcategory_id = ${rfp.subcategory_id} AND store_id = s.id)
  AND s.is_online = TRUE      
    `;
  if (rfp.type === global.RFP_TYPE.DELIVERY) {
    query += ` AND s.delivery = TRUE`;
  } else {
    query += ` AND s.pickup = TRUE`;
  }
  if (s_ids.length) {
    query += ` AND s.id NOT IN (${s_ids})`;
  }
  if (rfp.lat && rfp.lng) {
    query += ` HAVING distance < ${parseInt(process.env.RFP_MAX_RADIUS)}`;
  }
  query += ` LIMIT 5`;

  console.log("query:", query);
  result = await sails.sendNativeQuery(query);

  let extra_data = null;
  if (result.rows.length) {
    console.log("stores:", result.rows);
    for (store of result.rows) {
      sails.log(`sending request to store id '${store.id}'`);
      await sails.models.request_for_proposal_store.create({
        rfp_id: rfp.id,
        store_id: store.id,
        status_id: statuses.pending,
      });
      title = "RFP received";
      body = "A RFP has been received";
      extra_data = JSON.stringify({ id: rfp.id || null });

      await sails.helpers.sendPushNotification(
        store.vendor_id,
        global.ROLE.VENDOR,
        title,
        body,
        false,
        extra_data,
        sails.config.notification.type.RFP_RECEIVED
      );

      await sails.helpers.general.addNotification(
        store.vendor_id,
        global.ROLE.VENDOR,
        title,
        body,
        extra_data,
        sails.config.notification.type.RFP_RECEIVED
      );
    }
    sails.log(`Now sending push notification to user id ${rfp.user_id}`);
    extra_data = JSON.stringify({ queue_id: queue.id || null });

    title = "RFP created";
    body = "Your RFP has been sent to some vendors";
    await sails.helpers.sendPushNotification(
      rfp.user_id,
      global.ROLE.USER,
      title,
      body,
      true,
      extra_data,
      sails.config.notification.type.QUEUE_CALLED
    );
  } else {
    sails.log(
      `There is no stores found in current radius for rfp id '${rfp.id}, queue: ${queue}'`
    );
    let extra_data = JSON.stringify({ queue_id: queue.id || null });

    title = "No vendors found";
    body = "No vendors found";
    await Request_for_proposal.updateOne({ id: rfp.id }).set({
      status_id: statuses[global.STATUS.QUEUE_STOPPED],
    });
    await sails.helpers.sendPushNotification(
      rfp.user_id,
      global.ROLE.USER,
      title,
      body,
      true,
      extra_data,
      sails.config.notification.type.NO_VENDORS_FOUND
    );
  }
  //  var queue = await Rfp_queue.findOne({rfp_id: rfp.id});
  //  if(!queue){
  //    queue = await Rfp_queue.create({
  //      rfp_id: rfp.id,
  //      last_step : 0,
  //      last_radius : initial_radius
  //    }).fetch();
  //  }
  let rec = {};
  rec.last_run_at = moment().format("YYYY-MM-DD HH:mm:ss");
  rec.last_step = queue.last_step + 1;
  rec.last_radius = parseInt(queue.last_radius) + parseInt(radius_step);
  console.log("rec now:", rec);
  await Rfp_queue.updateOne({ id: queue.id }).set(rec);
}
module.exports = {
  friendlyName: "Start queue",

  description: "",

  inputs: {
    rfp_id: {
      type: "number",
      required: false,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper cron/start-queue");
    console.log({
      message: `business logic running every ${process.env.QUEUE_TIME} seconds with value: ${inputs.value}`,
      time: moment().format("DD/MM/YYYY HH:mm:ss"),
    });
    try {
      const max_steps = 3;
      let initial_radius = 1;
      let radius_step = process.env.RADIUS_STEP;
      let store_ids = [];
      const statuses = await sails.helpers.getAllStatuses();

      let rfps = [];
      let query = `
        SELECT rfp.id,rfp.type,rfp.subcategory_id,rfp.user_id,rfp.createdAt,
        rfp.lat,rfp.lng
        FROM request_for_proposals rfp
        WHERE 
        rfp.status_id IN (${statuses[global.STATUS.REQUIRE_QUEUE]})
        AND rfp.lat IS NOT NULL AND rfp.lng IS NOT NULL
        AND rfp.id NOT IN (SELECT rfp_id FROM rfp_queue WHERE last_radius >= ${
          process.env.RFP_MAX_RADIUS
        })
        `;
      if (!_.isUndefined(inputs.rfp_id)) {
        query += ` AND rfp.id = ${inputs.rfp_id}`;
      }
      console.log(query);
      let result = await sails.sendNativeQuery(query);
      if (result.rows.length) {
        rfps = result.rows;
      }
      if (rfps.length) {
        sails.log(`${rfps.length} rfps to be processed`);
        for (rfp of rfps) {
          var run_queue = true;
          var queue = await Rfp_queue.findOne({ rfp_id: rfp.id });
          if (queue) {
            // if(queue.step >= max_steps){
            //   run_queue = false;
            // }

            // console.log({last_run_at: queue.last_run_at});
            var duration = moment.duration(moment().diff(queue.last_run_at));
            var minutes = duration.asMinutes();
            var seconds = duration.asSeconds();
            // sails.log({seconds: seconds})
            if (minutes < 1) {
              // run_queue = false;
            }
            let rfp_store_count = await Request_for_proposal_store.count({
              rfp_id: rfp.id,
            });
            if (queue.last_radius >= process.env.RFP_MAX_RADIUS) {
              run_queue = false;
              if (rfp_store_count <= 0) {
                sails.log(`No vendors found for rfp id ${rfp.id}`);
                let extra_data = JSON.stringify({ queue_id: queue.id || null });

                title = "No vendors found";
                body = "No vendors found";
                await sails.helpers.sendPushNotification(
                  rfp.user_id,
                  global.ROLE.USER,
                  title,
                  body,
                  true,
                  extra_data,
                  sails.config.notification.type.NO_VENDORS_FOUND
                );
                await Request_for_proposal.updateOne({ id: rfp.id }).set({
                  status_id: statuses[global.STATUS.QUEUE_STOPPED],
                });
              }
            }
            const expiry_minutes = process.env.EXPIRY_TIME_RFP;
            sails.log({ createdAt: moment(rfp.createdAt), now: moment() });
            var duration = moment.duration(
              moment().diff(moment(rfp.createdAt))
            );
            var minutes = duration.asMinutes();
            sails.log({
              expiry_minutes11: expiry_minutes,
              minutes11: minutes,
              rfp_store_count: rfp_store_count,
            });
            if (minutes >= expiry_minutes) {
              run_queue = false;
              sails.log(`expiring RFP id ${rfp.id}`);
              await Request_for_proposal.updateOne({ id: rfp.id }).set({
                status_id: statuses[global.STATUS.EXPIRED],
              });

              title = "RFP Exipred";
              body = "Your RFP has been expired";
              let extra_data = JSON.stringify({
                rfp_id: rfp.id || null,
                sent_by: {
                  name: "waspha",
                  avatar:
                    "https://waspha.s3.amazonaws.com/settings/RljflptR3z.png",
                },
              });

              await sails.helpers.sendPushNotification(
                rfp.user_id,
                global.ROLE.USER,
                title,
                body,
                true,
                extra_data,
                sails.config.notification.type.RFP_EXPIRED
              );
              await sails.helpers.general.addNotification(
                rfp.user_id,
                global.ROLE.USER,
                title,
                body,
                extra_data,
                sails.config.notification.type.RFP_EXPIRED
              );
            }
            if (!(rfp.lat && rfp.lng)) {
              //run_queue = false;
            }
            //console.log({minutes: minutes});
          } else {
            queue = await Rfp_queue.create({
              rfp_id: rfp.id,
              last_step: 0,
              last_radius: 0,
            }).fetch();
          }

          if (run_queue === true) {
            //expiring previous pending requests to vendors
            let query = `
            UPDATE request_for_proposal_store 
            SET status_id = ${statuses.expired}
            WHERE rfp_id = ${rfp.id}
            AND status_id = ${statuses.pending}
            AND (createdAt  + INTERVAL ${process.env.EXPIRY_TIME_RFP_TO_VENDOR} MINUTE) <  NOW()
            `;
            console.log({ query_on_EXPIRY_TIME_RFP_TO_VENDOR: query });
            let result = await sails.sendNativeQuery(query);
            //  console.log({queue: queue});
            query = `
            SELECT rfp_store.store_id,rfp_store.status_id
            FROM request_for_proposal_store rfp_store      
            WHERE rfp_store.rfp_id = ${rfp.id}          
            `;

            result = await sails.sendNativeQuery(query);
            console.log({
              affectedRowsForExpireRFPsToVendors: result.affectedRows,
            });
            let run = true;
            if (result.rows.length) {
              store_ids = _.map(result.rows, "store_id");
              let rfp_store_statuses = _.map(result.rows, "status_id");

              if (rfp_store_statuses.includes(statuses.pending)) {
                run = false;
              }
              sails.log({ rfp_store_statuses: rfp_store_statuses, run: run });
              sails.log(
                `store ids to which rfp id '${rfp.id}' is sent : ${store_ids}`
              );
            }
            if (run == true) {
              await processQ(
                rfp,
                store_ids,
                initial_radius,
                radius_step,
                queue
              );
            }
          }
        }
      } else {
        sails.log(`There is no rfps to be processed`);
        //return exits.success();
      }
      sails.log("ending helper start-queue");
      return exits.success();
    } catch (err) {
      sails.log.error(`Error in queue. ${err}`);
      return exits.success();
    }
    sails.log("ending helper start-queue");
    return exits.success();
  },
};
