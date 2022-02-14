module.exports = {
  friendlyName: "Get avg rating",

  description: "",

  inputs: {
    id: {
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
      outputFriendlyName: "Avg rating",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action general/get-avg-rating");
    let rating = 0;
    try {
      let result = null;
      switch (inputs.role) {
        case global.ROLE.VENDOR: {
          result = await Store_review_rating.avg("rating").where({
            store_id: inputs.id,
          });
          break;
        }
        case global.ROLE.USER: {
          result = await User_review_rating.avg("rating").where({
            user_id: inputs.id,
          });
          break;
        }
        case global.ROLE.DRIVER: {
          result = await Driver_review_rating.avg("rating").where({
            driver_id: inputs.id,
          });
          break;
        }
      }
      sails.log(result);
      if (result) {
        result = parseFloat(result.toFixed(2));
        rating = result;
      }
      return exits.success(rating);
    } catch (err) {
      sails.log.error(`Error in helper general/get-avg-rating. ${err}`);
      return exits.success(rating);
    }
  },
};
