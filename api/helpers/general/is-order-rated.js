module.exports = {
  friendlyName: "Is order rated",

  description: "",

  inputs: {
    id: {
      type: "number",
      required: true,
    },
    order_id: {
      type: "number",
      required: true,
    },
    role: {
      type: "string",
      required: true,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action general/is-order-rated");
    let is_rated = false;
    try {
      let result = null;
      switch (inputs.role) {
        case global.ROLE.VENDOR: {
          result = await User_review_rating.find({
            order_id: inputs.order_id,
            store_id: inputs.id,
          }).limit(1);
          if (!result.length) {
            result = await Driver_review_rating.find({
              order_id: inputs.order_id,
              store_id: inputs.id,
            }).limit(1);
          }
          break;
        }
        case global.ROLE.USER: {
          result = await Store_review_rating.find({
            order_id: inputs.order_id,
            user_id: inputs.id,
          }).limit(1);
          if (!result.length) {
            result = await Driver_review_rating.find({
              order_id: inputs.order_id,
              user_id: inputs.id,
            }).limit(1);
          }
          break;
        }
        case global.ROLE.DRIVER: {
          result = await User_review_rating.find({
            order_id: inputs.order_id,
            driver_id: inputs.id,
          }).limit(1);
          if (!result.length) {
            result = await Store_review_rating.find({
              order_id: inputs.order_id,
              driver_id: inputs.id,
            }).limit(1);
          }
          break;
        }
      }

      if (result.length) {
        is_rated = true;
      }
      return exits.success(is_rated);
    } catch (err) {
      sails.log.error(`Error in helper general/is-order-rated. ${err}`);
      return exits.success(is_rated);
    }
  },
};
