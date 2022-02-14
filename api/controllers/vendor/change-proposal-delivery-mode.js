const { notification } = require("../../../config/strings");

const strings = sails.config.strings;

module.exports = {
  friendlyName: "Change proposal delivery mode",

  description: "",

  inputs: {
    vendor: {
      type: "ref",
      required: true,
      description: "logged in vendor",
    },
    id: {
      type: "number",
      required: true,
    },
    delivery_mode_id: {
      type: "number",
      required: true,
    },
    delivery_vehicle_id: {
      type: "number",
      required: false,
    },
    delivery_fee: {
      type: "number",
      required: false,
    },
    eta: {
      type: "string",
      required: false,
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
    sails.log("calling action vendor/change-proposal-delivery-mode");

    try {
      const proposal = await Proposal.findOne({ id: inputs.id });
      if (!proposal) {
        return exits.ok({
          status: false,
          message: strings[inputs.vendor.language].INVALID_ID,
        });
      }
      if (proposal.delivery_mode_id === inputs.delivery_mode_id) {
        return exits.ok({
          status: false,
          message: strings[inputs.vendor.language].NO_NEED_TO_CHANGE,
        });
      }
      const statuses = await sails.helpers.getAllStatuses([
        global.STATUS.USER_APPROVAL_PENDING,
      ]);
      let rec = { delivery_mode_id: inputs.delivery_mode_id };
      if (!_.isUndefined(inputs.delivery_vehicle_id)) {
        rec.delivery_vehicle_id = inputs.delivery_vehicle_id;
      }
      if (!_.isUndefined(inputs.delivery_fee)) {
        rec.delivery_fee = inputs.delivery_fee;
      }
      if (!_.isUndefined(inputs.eta)) {
        rec.eta = inputs.eta;
      }

      rec.status_id = statuses[global.STATUS.USER_APPROVAL_PENDING];
      rec.is_delivery_mode_changed = true;

      if (inputs.delivery_mode_id == 3) {
        rec.delivery_fee = await sails.helpers.getProposalEstimateDeliveryFee(
          proposal.id
        );
      }
      if (inputs.delivery_mode_id == 3 || proposal.delivery_mode_id == 3) {
        rec.old_delivery_fee = proposal.delivery_fee;
      }
      const updated = await sails.models.proposal
        .updateOne({ id: proposal.id })
        .set(rec);

      user = await sails.helpers.getUserOfOrder(updated.id, "proposal");
      if (user) {
        let notification_type =
          sails.config.notification.type.DELIVERY_MODE_CHANGED;
        let template = await sails.helpers.getNotificationTemplate(
          notification_type
        );
        business_name = await sails.helpers.convertHtmlIntoText(
          inputs.vendor.store.business_name
        );
        let title = template.meta[user.language];
        let body = template[user.language].replace("{order_id}", proposal.id);
        let extra_data = JSON.stringify({
          id: proposal.id || null,
          sent_by: {
            name: business_name,
            avatar: inputs.vendor.store.image,
          },
        });
        await sails.helpers.general.addNotification(
          user.id,
          global.ROLE.USER,
          title,
          body,
          extra_data,
          notification_type
        );

        await sails.helpers.sendPushNotification(
          user.id,
          global.ROLE.USER,
          title,
          body,
          false,
          extra_data,
          notification_type
        );
      }
      if (updated) {
        return exits.success({
          status: true,
          message: `Delivery mode changed successfully`,
          message: strings[inputs.vendor.language].CHANGED,
          data: updated,
        });
      }
      return exits.ok({
        status: false,
        message: strings[inputs.vendor.language].UNABLE_TO_CHANGE,
        data: [],
      });
    } catch (err) {
      sails.log.error(`Error changing proposal delivery mode ${err}`);
      return exits.serverError({
        status: false,
        message: strings[inputs.vendor.language].UNABLE_TO_CHANGE,
        data: [],
      });
    }
  },
};
