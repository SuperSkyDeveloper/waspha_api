async function createRecordObj(inputs) {
  let rec = { id: inputs.id };
  if (inputs.name) {
    rec["name"] = inputs.name;
  }

  if (inputs.vehicle_id) {
    rec["vehicle_id"] = inputs.vehicle_id;
  }
  if (inputs.vehicle_name) {
    rec["vehicle_name"] = inputs.vehicle_name;
  }
  if (inputs.number_plate) {
    rec["number_plate"] = inputs.number_plate;
  }
  if (inputs.is_online && inputs.is_online === true) {
    rec["delivery_mode_id"] = 1; //will be dynamic and fetched from delivery_modes table
  } else {
    rec["delivery_mode_id"] = 2; //will be dynamic and fetched from delivery_modes table
  }
  if (inputs.avatar) {
    //rec['avatar'] = await sails.helpers.aws.uploadFile(inputs.avatar,'drivers');
    rec["avatar"] = inputs.avatar;
  }
  rec["status"] = true;

  console.log(`rec:`, rec);
  return rec;
}
module.exports = {
  friendlyName: "Edit driver",

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
    name: {
      type: "string",
      required: false,
    },
    password: {
      type: "string",
      required: false,
    },
    vehicle_id: {
      type: "number",
      required: false,
    },
    vehicle_name: {
      type: "string",
      required: false,
    },
    number_plate: {
      type: "string",
      required: false,
    },
    avatar: {
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
    sails.log("calling action vendor/edit-driver");

    let driver = await Driver.findOne({ id: inputs.id });
    if (!driver) {
      return exits.ok({
        status: false,
        data: [],
        message:
          sails.config.strings[inputts.vendor.language].INVALID_DRIVER_ID,
      });
    }

    const rec = await createRecordObj(inputs);
    rec["store_id"] = inputs.vendor.store.id;
    var old_avatar = driver.avatar;
    driver = await Driver.findOne({
      id: inputs.id,
      store_id: inputs.vendor.store.id,
    });

    if (driver.id) {
      driver = await Driver.updateOne({ id: driver.id }).set(rec);
      if (inputs.avatar) {
        let position = await sails.helpers.getCharacterPosition(
          old_avatar,
          "/",
          3
        );
        await sails.helpers.aws.deleteFile(old_avatar.substring(position + 1));
      }
      if (inputs.password) {
        sails.log(`Encrypting driver password`);

        let passwordChanged = await sails.helpers.changePassword(
          inputs.id,
          inputs.password,
          "driver"
        );
      }
      sails.log(`driver updated with email '${driver.email}'`);
      delete driver.password;

      return exits.success({
        status: true,
        data: driver,
        message: sails.config.strings[inputs.vendor.language].DRIVER_UPDATED,
      });
    }
    return exits.ok({
      status: false,
      message: sails.config.strings[inputs.vendor.language].NOT_FOUND,
      data: [],
    });
  },
};
