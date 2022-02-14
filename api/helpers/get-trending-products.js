module.exports = {
  friendlyName: "Get trending products",

  description: "",

  inputs: {
    store_id: {
      type: "number",
      required: true,
    },
  },

  exits: {
    success: {
      outputFriendlyName: "Trending products",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper get-trending-products");
    try {
      // let products = await Store_product.find({
      //   where:{
      //     store_id: inputs.store_id,
      //     deletedAt: null
      //  },
      //  select: ['title','description','image','category_id']
      // });
      let query = `
      SELECT DISTINCT(sp.id), sp.title,sp.title_ar,sp.description,sp.description_ar,sp.image,sp.image_ar,sp.category_id,
      (SELECT COUNT(product_id) FROM request_for_proposal_items WHERE product_id = sp.id) AS total_sale
            FROM request_for_proposal_items rfp_items
            INNER JOIN store_products sp
              ON sp.id = rfp_items.product_id
            INNER JOIN request_for_proposal_store rfp_store
              ON rfp_store.rfp_id = rfp_items.rfp_id
            INNER JOIN proposals p
              ON p.rfp_store_id = rfp_store.id
            WHERE 
            product_id IS NOT NULL
            AND sp.store_id = ${inputs.store_id}
            AND sp.deletedAt IS NULL
            HAVING  total_sale > 4
            ORDER BY total_sale DESC
            LIMIT 10                             
      `;

      let result = await sails.sendNativeQuery(query);
      if (result.rows.length) {
        let menu_promotions = await sails.helpers.getMenuPromotions();
        let products = result.rows;
        let all_products = [];
        for (value of products) {
          value.store_id = inputs.store_id;
          value.is_trending = true;
          value.is_featured = false;
          value.title = {
            en: value.title,
            ar: value.title_ar,
          };
          value.image = {
            en: value.image,
            ar: value.image_ar,
          };
          value.description = {
            en: value.description,
            ar: value.description_ar,
          };
          delete value.title_ar;
          delete value.image_ar;
          delete value.description_ar;
          value.menu_promotion = await sails.helpers.getMenuPromotion(
            value.id,
            menu_promotions
          );
          if (value.menu_promotion) {
            value.is_featured = true;
          }
          all_products.push(value);
        }
        sails.log(`${all_products.length} trending products found`);
        return exits.success(all_products);
      }
      sails.log(`No trending products found`);
      return exits.success(false);
    } catch (err) {
      sails.log.error(
        `Error getting trending products for store id ${inputs.store_id}. Error: ${err}`
      );
      return exits.success(false);
    }
  },
};
