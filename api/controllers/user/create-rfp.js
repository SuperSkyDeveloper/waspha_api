const moment = require("moment");
const { exec } = require("child_process");

module.exports = {
  friendlyName: "Create rfp",

  description: "",

  inputs: {
    user: {
      type: "ref",
      required: true,
      description: "logged in user",
    },
    store_id: {
      type: "number",
      required: false,
    },
    subcategory_id: {
      type: "number",
      required: false,
    },
    delivery_location: {
      type: "json",
      required: false,
      custom: function (value) {
        return (
          _.isObject(value) &&
          typeof value.address !== "undefined" &&
          typeof value.lat !== "undefined" &&
          typeof value.lng !== "undefined" &&
          _.isString(value.address) &&
          _.isNumber(value.lat) &&
          _.isNumber(value.lng)
        );
      },
    },
    delivery_mode_id: {
      type: "number",
      required: false,
      defaultsTo: 1,
    },
    landmark: {
      type: "string",
      required: false,
    },
    scheduled_delivery_time: {
      type: "string",
      required: false,
    },
    type: {
      type: "string",
      required: false,
      isIn: ["delivery", "pickup"],
    },
    items: {
      type: "json",
      required: true,
      custom: function (value) {
        for (i of value) {
          let flag = false;
          if (!i.product_id) {
            flag =
              _.isObject(i) &&
              typeof i.name !== "undefined" &&
              typeof i.quantity !== "undefined" &&
              typeof i.requirements !== "undefined" &&
              typeof i.image !== "undefined" &&
              _.isString(i.name) &&
              _.isNumber(i.quantity);
            // && _.isString(i.requirements)
            // _.isString(i.image);
          } else {
            flag = true;
          }

          if (flag == false) {
            return flag;
          }
        }
        return true;
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
    //console.log(global.strings['en'].INVALID_EMAIL);

    sails.log(
      `calling action user/create-rfp at ${await sails.helpers.calledAt()}`
    );
    const strings = sails.config.strings[inputs.user.language];
    try {
      const statuses = await sails.helpers.getAllStatuses();
      const templates = await sails.helpers.getAllNotificationTemplates();

      let user = inputs.user;
      let delivery_location = inputs.delivery_location;
      let items = inputs.items;

      if (inputs.store_id) {
        var store = await Store.findOne({ id: inputs.store_id });
        if (!store) {
          return exits.ok({
            status: false,
            message: strings.INVALID_STORE_ID,
            data: [],
          });
        }
      } else {
        let existing_rfp_for_queue = await Request_for_proposal.find({
          user_id: inputs.user.id,
          status_id: statuses[global.STATUS.REQUIRE_QUEUE],
        }).limit(1);
        sails.log({ existing_rfp_for_queue: existing_rfp_for_queue });
        if (existing_rfp_for_queue.length) {
          return exits.ok({
            status: false,
            message: strings.YOU_HAVE_AN_ACTIVE_ORDER_ALREADY,
            data: [],
          });
        }
      }

      const rec = {
        user_id: user.id,
        delivery_mode_id: inputs.delivery_mode_id,
        //status_id: statuses.pending
      };
      if (!_.isEmpty(inputs.delivery_location)) {
        rec.delivery_location = inputs.delivery_location.address;
        rec.lat = inputs.delivery_location.lat;
        rec.lng = inputs.delivery_location.lng;
      } else {
        rec.type = global.RFP_TYPE.PICKUP;
      }
      if (inputs.subcategory_id) {
        const subcategoryExist = await sails.helpers.categoryExist.with({
          id: inputs.subcategory_id,
        });
        if (!subcategoryExist) {
          return exits.ok({
            status: false,
            data: [],
            message: strings.INVALID_SUBCATEGORY,
          });
        }
        rec["subcategory_id"] = inputs.subcategory_id;
      }
      if (inputs.landmark) {
        rec["landmark"] = inputs.landmark;
      }
      if (inputs.scheduled_delivery_time) {
        rec["scheduled_delivery_time"] = moment(
          inputs.scheduled_delivery_time
        ).format("YYYY-MM-DD HH:mm:ss");
      }
      if (inputs.type) {
        rec["type"] = inputs.type;
      }

      var rfp = null;
      rfp = await sails.models.request_for_proposal.create(rec).fetch();
      if (rfp.id) {
        sails.log(`RFP created with id '${rfp.id}'`);

        sails.log(`Attaching items for RFP with id '${rfp.id}'`);

        for (const item of items) {
          item.rfp_id = rfp.id;
          if (item.image) {
            let is_valid_url = await sails.helpers.isValidUrl(item.image);
            console.log({ is_valid_url: is_valid_url });
            if (is_valid_url === false) {
              item.image = await sails.helpers.aws.uploadFile(
                item.image,
                "rfp-items"
              );
            }
            //delete item.image
          }
          if (item.product_id) {
            /// check for valid product id
          }
          await Request_for_proposal_item.create(item);
        }

        let queue = {};
        if (inputs.store_id) {
          ////
          sails.log({ rfp_id: rfp });

          sails.log(
            `Store id ${inputs.store_id} is provided, associating rfp to store`
          );
          //await sails.models.request_for_proposal.addToCollection(rfp.id, 'stores', inputs.store_id);
          await sails.models.request_for_proposal_store.create({
            rfp_id: rfp.id,
            store_id: inputs.store_id,
            status_id: statuses.pending,
            is_specific: true,
          });
          rfp = await Request_for_proposal.updateOne({ id: rfp.id }).set({
            status_id: statuses[global.STATUS.UPCOMING],
          });

          let vendor = await sails.helpers.getVendorOfOrder(rfp.id, "rfp");
          let template = await sails.helpers.getNotificationTemplate(
            sails.config.notification.type.RFP_RECEIVED
          );
          let title = template.meta[vendor.language];
          let body = template[vendor.language].replace(
            "{user}",
            inputs.user.name
          );
          let extra_data = JSON.stringify({
            id: rfp.id || null,
            sent_by: { name: inputs.user.name, avatar: inputs.user.avatar },
          });

          sails.log({ template: template });
          await sails.helpers.sendPushNotification(
            vendor.id,
            global.ROLE.VENDOR,
            title,
            body,
            false,
            extra_data,
            sails.config.notification.type.RFP_RECEIVED
          );

          await sails.helpers.general.addNotification(
            vendor.id,
            global.ROLE.VENDOR,
            title,
            body,
            extra_data,
            sails.config.notification.type.RFP_RECEIVED
            //templates[sails.config.notification.type.RFP_RECEIVED]
          );
        } else {
          sails.log(`calling queue first time for rfp id ${rfp.id}`);

          //console.log("status:",statuses[global.STATUS.REQUIRE_QUEUE]);
          if (!inputs.store_id) {
            rfp = await Request_for_proposal.updateOne({ id: rfp.id }).set({
              status_id: statuses[global.STATUS.REQUIRE_QUEUE],
            });
          }
        }

        await sails.helpers.updateCoordinates(
          { lat: rfp.lat, lng: rfp.lng },
          rfp.id,
          "request_for_proposals"
        );
        if (!inputs.store_id) {
          await sails.helpers.cron.startQueue(rfp.id);
        }

        return exits.success({
          status: true,
          data: rfp,
          message: strings.RFP_CREATED,
        });
      }
      return exits.ok({
        status: false,
        message: strings.UNABLE_TO_CREATE,
      });
    } catch (err) {
      sails.log.error(`Error in creating RFP: ${err}`);
      return exits.serverError({
        status: false,
        message: strings.UNABLE_TO_CREATE,
      });
    }
  },
};
