const moment = require("moment");
module.exports = {
  friendlyName: "Add delivery vehicle charge",

  description: "",

  inputs: {
    country: {
      type: "number",
      required: true,
    },
    data: {
      type: "json",
      required: true,
    },
  },

  exits: {
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
    invalidRequest: {
      description: "Send invalidRequest response",
      responseType: "invalidRequest",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action super-admin/add-delivery-vehicle-charge");
    let country = inputs.country;
    let input_data = JSON.parse(inputs.data);
    try {
      let exist = await Delivery_vehicle_charge.find({
        country: country,
      }).limit(1);
      if (exist.length) {
        return exits.invalidRequest({
          status: false,
          message:
            "Delivery vehicle charges already exist for selected country",
          data: null,
        });
      }

      let obj = { delivery_vehicle: null };
      let all_rec = [];
      for (var key in input_data) {
        if (input_data.hasOwnProperty(key)) {
          var delivery_vehicle = key.match(/\d+/g)[0];
          var actual_key = key.replace(delivery_vehicle, "");
          if (obj.delivery_vehicle != delivery_vehicle) {
            if (obj.delivery_vehicle) {
              all_rec.push(obj);
            }
            obj = { delivery_vehicle: delivery_vehicle };
          }
          obj[actual_key] = input_data[key];
        }
      }
      all_rec.push(obj);
      let created = null;
      for (rec of all_rec) {
        rec.country = country;
        created = await Delivery_vehicle_charge.create(rec).fetch();
      }

      return exits.success({
        status: true,
        message: "Created successfully",
        data: created,
      });
    } catch (err) {
      sails.log(
        `Error in action super-admin/add-delivery-vehicle-charge. ${err}`
      );
      return exits.ok({
        status: false,
        message: "Unable to create",
      });
    }
  },
};
