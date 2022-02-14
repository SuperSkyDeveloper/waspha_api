module.exports = {
  friendlyName: "Get searched products",

  description: "",

  inputs: {
    store_id: {
      type: "number",
      required: true,
    },
    search_text: {
      type: "string",
      required: true,
    },
  },

  exits: {
    success: {
      outputFriendlyName: "Searched products",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper get-seaerched-products");
    const store_id = inputs.store_id;
    const search_text = inputs.search_text;
    try {
      var query = `
      SELECT sp.id,sp.title,sp.title_ar,sp.description,sp.description_ar,sp.image,sp.image_ar,sp.category_id FROM store_products sp
      LEFT JOIN business_categories c 
        ON c.id = sp.category_id
      WHERE sp.store_id = ${store_id}
      AND sp.deletedAt IS NULL
      AND 
      (sp.title LIKE '%${search_text}%'
      OR c.name LIKE '%${search_text}%')
      `;
      var result = await sails.sendNativeQuery(query);
      if (result.rows.length) {
        let items = result.rows;
        for (item of items) {
          item.title = {
            en: item.title,
            ar: item.title_ar,
          };
          item.image = {
            en: item.image,
            ar: item.image_ar,
          };
          item.description = {
            en: item.description,
            ar: item.description_ar,
          };
          delete item.title_ar;
          delete item.image_ar;
          delete item.description_ar;
        }
        return exits.success(items);
      }
      return exits.success([]);
    } catch (err) {
      sails.log.error(
        `Error searching products for store id ${inputs.store_id}. ${err}`
      );
      return exits.success([]);
    }
  },
};
