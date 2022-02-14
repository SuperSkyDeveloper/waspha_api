module.exports = {
  friendlyName: "Create review rating",

  description: "",

  inputs: {
    user: {
      type: "ref",
      required: true,
      description: "logged in user",
    },
    order_id: {
      type: "number",
      required: true,
    },
    store: {
      type: "json",
      required: true,
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
    sails.log("calling action user/create-review-rating");
    const strings = sails.config.strings[inputs.user.language];
    let store = await Store.findOne({ id: inputs.store.id }).populate(
      "vendor_id"
    );
    if (!store) {
      return exits.ok({
        status: false,
        message: strings.INVALID_STORE_ID,
        data: [],
      });
    }
    if (inputs.driver) {
      var driver = await Driver.findOne({ id: inputs.driver.id });
      if (!driver) {
        return exits.ok({
          status: false,
          message: strings.INVALID_DRIVER_ID,
          data: [],
        });
      }
    }

    try {
      const rec_store = {
        user_id: inputs.user.id,
        store_id: inputs.store.id,
        order_id: inputs.order_id,
        review: inputs.store.review || null,
        rating: inputs.store.rating,
      };
      var review_rating = await Store_review_rating.create(rec_store).fetch();
      let loyalty_points_vendor = await sails.helpers.calculateLoyaltyPoints(
        global.ROLE.VENDOR,
        "rating",
        inputs.store.rating
      );
      sails.log({
        loyalty_points: loyalty_points_vendor,
      });
      if (loyalty_points_vendor) {
        await sails.helpers.general.updateLoyaltyPoints(
          store.vendor_id.id,
          global.ROLE.VENDOR,
          loyalty_points_vendor
        );
      }
      if (inputs.driver) {
        const rec_driver = {
          driver_id: inputs.driver.id,
          user_id: inputs.user.id,
          order_id: inputs.order_id,
          review: inputs.driver.review || null,
          rating: inputs.driver.rating,
        };
        var review_rating2 = await Driver_review_rating.create(
          rec_driver
        ).fetch();
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

      if (review_rating.id) {
        let template = await sails.helpers.getNotificationTemplate(
          sails.config.notification.type.REVIEW_RECEIVED
        );
        let title = template.meta[store.vendor_id.language];
        let body = template[store.vendor_id.language]
          .replace("{reviewer}", inputs.user.name)
          .replace("{order_id}", inputs.order_id);
        let extra_data = {
          order_id: inputs.order_id,
          sent_by: {
            name: inputs.user.name,
            avatar: inputs.user.avatar,
          },
          avg_rating: await sails.helpers.general.getAvgRating(
            store.id,
            global.ROLE.VENDOR
          ),
        };
        // extra_data = JSON.stringify(extra_data);
        await sails.helpers.sendPushNotification(
          store.vendor_id.id,
          global.ROLE.VENDOR,
          title,
          body,
          false,
          JSON.stringify(extra_data),
          sails.config.notification.type.REVIEW_RECEIVED
        );

        await sails.helpers.general.addNotification(
          store.vendor_id.id,
          global.ROLE.VENDOR,
          title,
          body,
          JSON.stringify(extra_data),
          sails.config.notification.type.REVIEW_RECEIVED
        );
        if (driver) {
          title = template.meta[driver.language];
          body = template[driver.language]
            .replace("{reviewer}", inputs.user.name)
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
        sails.log(`Review & rating created with id '${review_rating.id}'`);
        return exits.success({
          status: true,
          data: [review_rating],
          message: strings.SUBMITTED,
        });
      }
    } catch (err) {
      sails.log.error(`Error in creating review & rating: ${err}`);
      return exits.serverError({
        status: false,
        message: strings.UNABLE_TO_SUBMIT,
      });
    }
  },
};
