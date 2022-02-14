module.exports = {
  friendlyName: "Create review rating",

  description: "",

  inputs: {
    driver: {
      type: "ref",
      required: true,
      description: "logged in driver",
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
          !_.isUndefined(value.review) &&
          (_.isString(value.review) ||
            _.isNull(value.review) ||
            _.isEmpty(value.review)) &&
          !_.isUndefined(value.rating) &&
          _.isNumber(value.rating)
        );
      },
    },
    user: {
      type: "json",
      required: false,
      custom: function (value) {
        return (
          _.isObject(value) &&
          !_.isUndefined(value.id) &&
          _.isNumber(value.id) &&
          !_.isUndefined(value.review) &&
          (_.isString(value.review) ||
            _.isNull(value.review) ||
            _.isEmpty(value.review)) &&
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
    sails.log("calling action driver/create-review-rating");
    const strings = sails.config.strings[inputs.driver.language];
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
    if (!_.isUndefined(inputs.user)) {
      var user = await User.findOne({ id: inputs.user.id });
      if (!user) {
        return exits.ok({
          status: false,
          message: strings.INVALID_USER_ID,
          data: [],
        });
      }
    }

    try {
      //#region loyalty points
      let loyalty_points_vendor = await sails.helpers.calculateLoyaltyPoints(
        global.ROLE.VENDOR,
        "rating",
        inputs.store.rating
      );

      if (loyalty_points_vendor) {
        await sails.helpers.general.updateLoyaltyPoints(
          store.vendor_id.id,
          global.ROLE.VENDOR,
          loyalty_points_vendor
        );
      }
      if (!_.isUndefined(inputs.user)) {
        let loyalty_points_user = await sails.helpers.calculateLoyaltyPoints(
          global.ROLE.USER,
          "rating",
          inputs.user.rating
        );
        if (loyalty_points_user) {
          await sails.helpers.general.updateLoyaltyPoints(
            inputs.user.id,
            global.ROLE.USER,
            loyalty_points_user
          );
        }
      }
      //#endregion loayalty points

      const rec_store = {
        driver_id: inputs.driver.id,
        store_id: inputs.store.id,
        order_id: inputs.order_id,
        rating: inputs.store.rating,
      };
      if (!(_.isNull(inputs.store.review) || _.isEmpty(inputs.store.review))) {
        rec_store.review = inputs.store.review;
      }
      var review_rating = await Store_review_rating.create(rec_store).fetch();
      if (review_rating.id) {
        sails.log(`Review & rating created with id '${review_rating.id}'`);

        let template = await sails.helpers.getNotificationTemplate(
          sails.config.notification.type.REVIEW_RECEIVED
        );
        let title = template.meta[store.vendor_id.language];
        let body = template[store.vendor_id.language]
          .replace("{reviewer}", inputs.driver.name)
          .replace("{order_id}", inputs.order_id);
        let extra_data = {
          order_id: inputs.order_id,
          sent_by: {
            name: inputs.driver.name,
            avatar: inputs.driver.avatar,
          },
          avg_rating: await sails.helpers.general.getAvgRating(
            store.id,
            global.ROLE.VENDOR
          ),
        };
        extra_data = JSON.stringify(extra_data);
        await sails.helpers.sendPushNotification(
          store.vendor_id.id,
          global.ROLE.VENDOR,
          title,
          body,
          false,
          extra_data,
          sails.config.notification.type.REVIEW_RECEIVED
        );

        await sails.helpers.general.addNotification(
          store.vendor_id.id,
          global.ROLE.VENDOR,
          title,
          body,
          extra_data,
          sails.config.notification.type.REVIEW_RECEIVED
        );

        if (!_.isUndefined(inputs.user)) {
          const rec_user = {
            driver_id: inputs.driver.id,
            user_id: inputs.user.id,
            order_id: inputs.order_id,
            rating: inputs.user.rating,
          };
          if (
            !(_.isNull(inputs.user.review) || _.isEmpty(inputs.user.review))
          ) {
            rec_user.review = inputs.user.review;
          }
          var review_rating2 = await User_review_rating.create(
            rec_user
          ).fetch();

          title = template.meta[user.language];
          body = template[user.language]
            .replace("{reviewer}", inputs.driver.name)
            .replace("{order_id}", inputs.order_id);

          extra_data = JSON.parse(extra_data);
          extra_data.avg_rating = await sails.helpers.general.getAvgRating(
            user.id,
            global.ROLE.USER
          );
          extra_data = JSON.stringify(extra_data);
          await sails.helpers.sendPushNotification(
            user.id,
            global.ROLE.USER,
            title,
            body,
            false,
            extra_data,
            sails.config.notification.type.REVIEW_RECEIVED
          );

          await sails.helpers.general.addNotification(
            user.id,
            global.ROLE.USER,
            title,
            body,
            extra_data,
            sails.config.notification.type.REVIEW_RECEIVED
          );
        }
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
