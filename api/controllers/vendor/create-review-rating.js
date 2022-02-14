const strings = sails.config.strings;
module.exports = {
  friendlyName: "Create review rating",

  description: "",

  inputs: {
    vendor: {
      type: "ref",
      required: true,
      description: "logged in vendor",
    },
    order_id: {
      type: "number",
      required: true,
    },
    user: {
      type: "json",
      required: false,
      custom: function (value) {
        return (
          _.isObject(value) &&
          !_.isUndefined(value.id) &&
          _.isNumber(value.id) &&
          //&& (!_.isUndefined(value.review) && _.isString(value.review))
          !_.isUndefined(value.rating) &&
          _.isNumber(value.rating)
        );
      },
    },
    driver: {
      type: "json",
      required: false,
      custom: function (value) {
        return (
          _.isObject(value) &&
          !_.isUndefined(value.id) &&
          _.isNumber(value.id) &&
          //&& (!_.isUndefined(value.review) && _.isString(value.review))
          !_.isUndefined(value.rating) &&
          _.isNumber(value.rating)
        );
      },
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
    sails.log("calling action vendor/create-review-rating");
    if (!_.isUndefined(inputs.user)) {
      var user = await User.findOne({ id: inputs.user.id });
      if (!user) {
        return exits.ok({
          status: false,
          message: strings[inputs.vendor.language].INVALID_USER_ID,
          data: [],
        });
      }
    }
    if (!_.isUndefined(inputs.driver)) {
      var driver = await Driver.findOne({ id: inputs.driver.id });
      if (!driver) {
        return exits.ok({
          status: false,
          message: strings[inputs.vendor.language].INVALID_DRIVER_ID,
          data: [],
        });
      }
    }

    try {
      let template = await sails.helpers.getNotificationTemplate(
        sails.config.notification.type.REVIEW_RECEIVED
      );
      let data = [];
      business_name = await sails.helpers.convertHtmlIntoText(
        inputs.vendor.store.business_name
      );
      let extra_data = {
        order_id: inputs.order_id,
        sent_by: {
          name: business_name,
          avatar: inputs.vendor.store.image,
        },
      };
      //extra_data = JSON.stringify(extra_data);
      if (!_.isUndefined(inputs.user)) {
        let loyalty_points_user = await sails.helpers.calculateLoyaltyPoints(
          global.ROLE.USER,
          "rating",
          inputs.user.rating
        );
        sails.log({
          loyalty_points: loyalty_points_user,
        });
        if (loyalty_points_user) {
          await sails.helpers.general.updateLoyaltyPoints(
            inputs.user.id,
            global.ROLE.USER,
            loyalty_points_user
          );
        }
        const rec_user = {
          store_id: inputs.vendor.store.id,
          user_id: inputs.user.id,
          order_id: inputs.order_id,
          review: inputs.user.review || null,
          rating: inputs.user.rating,
        };
        var review_rating = await User_review_rating.create(rec_user).fetch();
        data.push(review_rating);

        let title = template.meta[user.language];
        let body = template[user.language]
          .replace("{reviewer}", business_name)
          .replace("{order_id}", inputs.order_id);

        extra_data.avg_rating = await sails.helpers.general.getAvgRating(
          user.id,
          global.ROLE.USER
        );
        await sails.helpers.sendPushNotification(
          user.id,
          global.ROLE.USER,
          title,
          body,
          false,
          JSON.stringify(extra_data),
          sails.config.notification.type.REVIEW_RECEIVED
        );

        await sails.helpers.general.addNotification(
          user.id,
          global.ROLE.USER,
          title,
          body,
          JSON.stringify(extra_data),
          sails.config.notification.type.REVIEW_RECEIVED
        );
      }
      if (!_.isUndefined(inputs.driver)) {
        const rec_driver = {
          driver_id: inputs.driver.id,
          store_id: inputs.vendor.store.id,
          order_id: inputs.order_id,
          review: inputs.driver.review || null,
          rating: inputs.driver.rating,
        };
        review_rating = await Driver_review_rating.create(rec_driver).fetch();
        data.push(review_rating);

        let loyalty_points_driver = await sails.helpers.calculateLoyaltyPoints(
          global.ROLE.DRIVER,
          "rating",
          inputs.driver.rating
        );
        if (loyalty_points_driver) {
          await sails.helpers.general.updateLoyaltyPoints(
            inputs.driver.id,
            global.ROLE.DRIVER,
            loyalty_points_driver
          );
        }
      }

      // if(review_rating.id)
      {
        sails.log(`Review & rating created with id '${review_rating.id}'`);

        if (driver) {
          business_name = await sails.helpers.convertHtmlIntoText(
            inputs.vendor.store.business_name
          );
          title = template.meta[driver.language];
          body = template[driver.language]
            .replace("{reviewer}", business_name)
            .replace("{order_id}", inputs.order_id);

          extra_data.avg_rating = await sails.helpers.general.getAvgRating(
            driver.id,
            global.ROLE.DRIVER
          );
          await sails.helpers.sendPushNotification(
            driver.id,
            global.ROLE.DRIVER,
            title,
            body,
            false,
            JSON.stringify(extra_data),
            sails.config.notification.type.REVIEW_RECEIVED
          );

          await sails.helpers.general.addNotification(
            driver.id,
            global.ROLE.DRIVER,
            title,
            body,
            JSON.stringify(extra_data),
            sails.config.notification.type.REVIEW_RECEIVED
          );
        }

        return exits.success({
          status: true,
          data: data,
          message: strings[inputs.vendor.language].SUBMITTED,
        });
      }
    } catch (err) {
      sails.log.error(`Error in creating review & rating: ${err}`);
      return exits.serverError({
        status: false,
        message: strings[inputs.vendor.language].UNABLE_TO_SUBMIT,
      });
    }
  },
};
