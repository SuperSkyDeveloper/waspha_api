const moment = require("moment");
function pluck(array, key) {
  return array.map((o) => o[key]);
}

module.exports = {
  friendlyName: "My orders",

  description: "",

  inputs: {
    user: {
      type: "ref",
      required: true,
      description: "logged in user",
    },
    status: {
      type: "string",
      required: false,
      isIn: ["current", "upcoming", "past"],
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
    sails.log("calling action user/my-orders");
    const strings = sails.config.strings[inputs.user.language];
    try {
      let statuses = await sails.helpers.getAllStatuses();
      let query = "";
      if (inputs.status) {
        switch (inputs.status) {
          case global.STATUS.UPCOMING: {
            // query = `
            //   SELECT  DISTINCT(rfp.id) as rfp_id, rfp.createdAt as rfp_created_at,rfp.type,
            //   c.id as c_id,c.name as c_en,c.image as c_image
            //   FROM users u
            //   INNER JOIN request_for_proposals rfp on u.id = rfp.user_id
            //   LEFT JOIN request_for_proposal_store rfp_store on rfp.id = rfp_store.rfp_id
            //   LEFT JOIN proposals p ON p.rfp_store_id = rfp_store.id
            //   LEFT JOIN statuses s ON rfp_store.status_id = s.id
            //   LEFT JOIN categories c ON c.id = rfp.subcategory_id
            //   WHERE rfp.user_id = ${inputs.user.id}
            //   AND rfp.status_id IN (${statuses[global.STATUS.REQUIRE_QUEUE]},${statuses[global.STATUS.PENDING]})
            //   AND p.id IS NULL
            //   AND rfp.deletedAt IS NULL
            //   `;
            query = `
              SELECT   DISTINCT(rfp.id) AS rfp_id, rfp.createdAt AS rfp_created_at,rfp.updatedAt,rfp.type,
              c.id AS c_id,c.en AS c_en,c.ar AS c_ar,c.image AS c_image
              FROM users u
              INNER JOIN request_for_proposals rfp ON u.id = rfp.user_id
                         
              LEFT JOIN categories c ON c.id = rfp.subcategory_id 
              WHERE rfp.user_id = ${inputs.user.id}
              AND rfp.status_id IN (${statuses[global.STATUS.REQUIRE_QUEUE]},${
              statuses[global.STATUS.PENDING]
            },${statuses[global.STATUS.UPCOMING]})
              AND NOT EXISTS(SELECT rfp_store.id    
              FROM request_for_proposal_store rfp_store
              INNER JOIN proposals p ON p.rfp_store_id = rfp_store.id        
              LEFT JOIN statuses s ON rfp_store.status_id = s.id WHERE rfp_store.rfp_id = rfp.id AND p.status_id IS NOT NULL)
              AND rfp.deletedAt IS NULL               
                `;
            break;
          }
          case global.STATUS.CURRENT: {
            query = `
                SELECT  DISTINCT(rfp.id) as rfp_id, rfp.createdAt as rfp_created_at,rfp.updatedAt,rfp.type,
                c.id as c_id,c.en AS c_en,c.ar AS c_ar,c.image as c_image
                FROM users u
                INNER JOIN request_for_proposals rfp on u.id = rfp.user_id
                INNER JOIN request_for_proposal_store rfp_store on rfp.id = rfp_store.rfp_id      
                INNER JOIN proposals p ON p.rfp_store_id = rfp_store.id  
                INNER JOIN statuses s ON rfp_store.status_id = s.id                             
                LEFT JOIN categories c ON c.id = rfp.subcategory_id 
                WHERE rfp.user_id = ${inputs.user.id}                          
                AND rfp.status_id IN(${statuses[global.STATUS.REQUIRE_QUEUE]},${
              statuses[global.STATUS.CURRENT]
            },${statuses[global.STATUS.QUEUE_STOPPED]})   
                AND p.status_id IS NOT NULL  
                AND p.status_id NOT IN (${statuses[global.STATUS.EXPIRED]})
                AND rfp.deletedAt IS NULL           
                `;
            console.log(query);
            break;
          }
          case global.STATUS.PAST: {
            // query = `
            //     SELECT  DISTINCT(rfp.id) as rfp_id, rfp.createdAt as rfp_created_at,rfp.type,
            //     c.id as c_id,c.en AS c_en,c.ar AS c_ar,c.image as c_image
            //     FROM users u
            //     INNER JOIN request_for_proposals rfp on u.id = rfp.user_id
            //     INNER JOIN categories c ON c.id = rfp.subcategory_id
            //     WHERE rfp.user_id = ${inputs.user.id}
            //     AND rfp.status_id IN (${statuses[global.STATUS.COMPLETED]},${
            //   statuses[global.STATUS.CANCELLED]
            // },${statuses[global.STATUS.REJECTED]},${
            //   statuses[global.STATUS.EXPIRED]
            // })
            //     AND rfp.deletedAt IS NULL
            //     `;
            query = `
                SELECT  DISTINCT(rfp.id) as rfp_id, rfp.createdAt as rfp_created_at,rfp.updatedAt,rfp.type,
                c.id as c_id,c.en AS c_en,c.ar AS c_ar,c.image as c_image
                FROM users u
                INNER JOIN request_for_proposals rfp on u.id = rfp.user_id                                    
                INNER JOIN categories c ON c.id = rfp.subcategory_id 
                LEFT JOIN request_for_proposal_store rfp_store on rfp.id = rfp_store.rfp_id      
                LEFT JOIN proposals p ON p.rfp_store_id = rfp_store.id  
                WHERE rfp.user_id = ${inputs.user.id}                          
                AND (rfp.status_id IN (${statuses[global.STATUS.COMPLETED]},${
              statuses[global.STATUS.CANCELLED]
            },${statuses[global.STATUS.REJECTED]},${
              statuses[global.STATUS.EXPIRED]
            })    
            OR p.status_id IN (${statuses[global.STATUS.EXPIRED]})
            )
                AND rfp.deletedAt IS NULL            
                `;
            break;
          }
        }
      } else {
        query = `
                SELECT  DISTINCT(rfp.id) as rfp_id, rfp.createdAt as rfp_created_at,rfp.updatedAt,rfp.type,
                c.id as c_id,c.en AS c_en,c.ar AS c_ar,c.image as c_image
                FROM users u
                INNER JOIN request_for_proposals rfp on u.id = rfp.user_id
                LEFT JOIN request_for_proposal_store rfp_store on rfp.id = rfp_store.rfp_id        
                INNER JOIN statuses s ON rfp_store.status_id = s.id                             
                INNER JOIN categories c ON c.id = rfp.subcategory_id 
                WHERE rfp.user_id = ${inputs.user.id}
                `;
      }

      if (inputs.status) {
        //query += ` AND rfp.status_id = ${statuses[inputs.status]}`
      }
      // else{
      //   query += ` AND p.status_id = ${statuses['accepted']}`
      // }
      query += ` ORDER BY rfp.updatedAt DESC LIMIT 10`;
      console.log(query);
      var orders = await sails.sendNativeQuery(query);

      if (orders.rows.length) {
        var all_orders = [];

        for (order of orders.rows) {
          var temp = {};
          temp["id"] = order.rfp_id;
          temp["order_date"] = order.rfp_created_at;
          temp["expiry_time"] = moment(order.rfp_created_at)
            .add(parseInt(process.env.EXPIRY_TIME_RFP), "minutes")
            .toISOString(); //will be fetched from admin panel later

          temp["type"] = order.type;
          temp["total_proposals"] = await sails.helpers.getProposalCountForRfp(
            order.rfp_id
          );
          temp["status"] = !_.isUndefined(inputs.status)
            ? inputs.status
            : "upcoming";
          // temp['subcategory'] = {
          //   id: order.sc_id,
          //   name: order.sc_en,
          //   image: order.sc_image
          // };
          temp["category"] = {
            id: order.c_id,
            name: { en: order.c_en, ar: order.c_ar },
            image: order.c_image,
          };

          all_orders.push(temp);
        }
        return exits.success({
          status: true,
          message: strings.FOUND,
          data: all_orders,
        });
      }
      return exits.ok({
        status: true,
        message: strings.NOT_FOUND,
        data: [],
      });
    } catch (err) {
      sails.log.error(
        `Error fetching orders for user id ${inputs.user.id}. Error: ${err}`
      );
      return exits.ok({
        status: false,
        message: strings.NOT_FOUND,
        data: [],
      });
    }
  },
};
