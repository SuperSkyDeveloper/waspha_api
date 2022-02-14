module.exports = {
  friendlyName: "Add notification",

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
    title: {
      type: "string",
      required: false,
      allowNull: true,
    },
    body: {
      type: "string",
      required: false,
      allowNull: true,
    },
    extra_data: {
      type: "string",
      required: true,
    },
    notification_type: {
      type: "string",
      required: true,
    },
    template_id: {
      type: "number",
      required: false,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    try {
      let rec = {};
      //rec.title = inputs.title;
      //rec.body = inputs.body;
      rec.extra_data = inputs.extra_data;
      rec.notification_type = inputs.notification_type;
      let created = null;
      if (inputs.template_id) {
        rec.template_id = inputs.template_id;
      } else {
        const templates = await sails.helpers.getAllNotificationTemplates();
        rec.template_id = templates[inputs.notification_type];
      }
      switch (inputs.role) {
        case global.ROLE.VENDOR: {
          rec.vendor_id = inputs.id;
          created = await Vendor_notification.create(rec).fetch();
          break;
        }
        case global.ROLE.USER: {
          rec.user_id = inputs.id;
          created = await User_notification.create(rec).fetch();
          break;
        }
        case global.ROLE.DRIVER: {
          rec.driver_id = inputs.id;
          created = await Driver_notification.create(rec).fetch();
          break;
        }
      }
      return exits.success(true);
    } catch (err) {
      sails.log(
        `Error in adding notification in helper general/add-notification, ${err}`
      );
      return exits.success(false);
    }
  },
};
