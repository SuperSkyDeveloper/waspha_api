function pluck(array, key) {
  return array.map((o) => o[key]);
}

module.exports = {
  friendlyName: "My order detail",

  description: "",

  inputs: {
    user: {
      type: "ref",
      required: true,
      description: "logged in user",
    },
    id: {
      type: "number",
      required: true,
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
    try {
      var statuses = await sails.helpers.getAllStatuses();

      let query = `
        SELECT  DISTINCT(rfp.id) as rfp_id, rfp.createdAt as rfp_created_at, rfp.delivery_location,rfp.lat,rfp.lng,rfp.type,
        c.id as c_id,c.en as c_en,c.ar as c_ar,c.image as c_image
        FROM users u
        INNER JOIN request_for_proposals rfp on u.id = rfp.user_id
        INNER JOIN request_for_proposal_store rfp_store on rfp.id = rfp_store.rfp_id        
        INNER JOIN statuses s ON rfp_store.status_id = s.id                             
        LEFT JOIN categories c ON rfp.subcategory_id = c.id                  
        WHERE rfp.user_id = ${inputs.user.id}      
        AND rfp.id = ${inputs.id}     
        `;

      var orders = await sails.sendNativeQuery(query);

      if (orders.rows.length) {
        var order = orders.rows[0];

        var temp = {};
        temp["id"] = order.rfp_id;
        temp["order_date"] = order.rfp_created_at;
        temp["type"] = order.type;
        temp["total_proposals"] = await sails.helpers.getProposalCountForRfp(
          order.rfp_id
        );
        temp["delivery_location"] = {
          address: order.delivery_location,
          lat: order.lat,
          lng: order.lng,
        };
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

        var items = await Request_for_proposal_item.find({
          where: { rfp_id: order.rfp_id },
          select: [
            "id",
            "name",
            "quantity",
            "requirements",
            "image",
            "additional_notes",
          ],
        }).populate("product_id");
        if (items.length) {
          let menu_promotions = await sails.helpers.getMenuPromotions();
          for (item of items) {
            sails.log({ itemProduct: item.product_id });
            item.description = item.requirements;
            delete item.requirements;
            if (item.product_id) {
              item.name = {
                en: item.product_id.title,
                ar: item.product_id.title_ar,
              };
              item.image = {
                en: item.product_id.image,
                ar: item.product_id.image_ar,
              };
              item.description = {
                en: item.product_id.description,
                ar: item.product_id.description_ar,
              };
              item.menu_promotion = await sails.helpers.getMenuPromotion(
                item.product_id.id,
                menu_promotions
              );
              item.product_id = item.product_id.id;
            }
          }
        }
        temp["items"] = items;

        return exits.success({
          status: true,
          message: sails.config.strings[inputs.user.language].ORDER_FOUND,
          data: temp,
        });
      }
      return exits.ok({
        status: true,
        message: sails.config.strings[inputs.user.language].ORDER_NOT_FOUND,
        data: [],
      });
    } catch (err) {
      sails.log.error(
        `Error fetching orders for user id ${inputs.user.id}. Error: ${err}`
      );
      return exits.ok({
        status: false,
        message: sails.config.strings[inputs.user.language].ORDER_NOT_FOUND,
        data: [],
      });
    }
  },
};
