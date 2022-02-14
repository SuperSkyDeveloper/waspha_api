module.exports = {
  friendlyName: "Get driver",

  description: "",

  inputs: {
    id: {
      type: "number",
      required: true,
    },
  },

  exits: {
    notFound: {
      description: "send notFound response",
      responseType: "notFound",
    },
    ok: {
      description: "Send ok response",
      responseType: "ok",
    },
    invalid: {
      description: "Send invalid response",
      responseType: "invalidRequest",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action admin/get-driver");
    try {
      const driver = await Driver.findOne({ id: inputs.id })
        .populate("store_id")
        .populate("vehicle_id");
      if (driver) {
        driver.vendor_id = _.isObject(driver.store_id)
          ? driver.store_id.id
          : null;
        driver.store = _.isObject(driver.store_id) ? driver.store_id : null;
        driver.store_id = _.isObject(driver.store_id)
          ? driver.store_id.id
          : null;
        driver.vehicle = driver.vehicle_id;
        driver.vehicle_id = _.isObject(driver.vehicle)
          ? driver.vehicle.id
          : null;
        var ride = await sails.helpers.hasRide(driver.id);
        driver.ride = ride;

        documents = await Driver_document.find({ driver_id: driver.id });
        driver.documents = {};
        i = 1;
        for (doc of documents) {
          driver.documents[`document${i++}`] = doc.document;
        }
        if (driver.documents.length) {
          //driver.document = driver.documents[0].document;
          //driver.documents = _.map(driver.documents, "document");
        }
        return exits.success({
          status: true,
          message: "driver found successfully",
          data: driver,
        });
      }
      return exits.notFound({
        status: false,
        message: "Driver not found",
        data: [],
      });
    } catch (err) {
      sails.log.error(`Error in action super-admin/get-driver. ${err}`);
      return exits.notFound({
        status: false,
        message: "Driver not found",
        data: [],
      });
    }
  },
};
