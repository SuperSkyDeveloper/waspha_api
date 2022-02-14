async function createRecordObj(inputs) {
  let rec = { id: inputs.id };
  if (inputs.name) {
    rec["name"] = inputs.name;
  }

  if (inputs.store_id) {
    rec["store_id"] = inputs.store_id;
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
  if (inputs.type) {
    rec["type"] = inputs.type;
  }
  rec["status"] = true;

  console.log(`rec:`, rec);
  return rec;
}
module.exports = {
  friendlyName: "Edit driver admin",

  description: "",

  inputs: {
    admin: {
      type: "ref",
      required: true,
      description: "logged in admin",
    },
    id: {
      type: "number",
      required: true,
    },
    store_id: {
      type: "number",
      required: true,
    },
    name: {
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
      allowNull: true,
    },
    type: {
      type: "string",
      required: false,
      isIn: ["online", "offline"],
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
    sails.log("calling action super-admin/edit-driver");

    let driver = await Driver.findOne({ id: inputs.id });
    if (!driver) {
      return exits.ok({
        status: false,
        data: [],
        message: sails.config.strings[inputts.admin.language].INVALID_DRIVER_ID,
      });
    }

    const rec = await createRecordObj(inputs);

    var old_avatar = driver.avatar;
    driver = await Driver.findOne({
      id: inputs.id,
      //store_id: inputs.store_id,
    });

    if (driver.id) {
      if (inputs.avatar) {
        sails.log({ avatar: inputs.avatar });
        is_valid_url = await sails.helpers.isValidUrl(inputs.avatar);
        if (!is_valid_url) {
          let existingImagePath = driver.avatar;
          if (existingImagePath != null) {
            let position = await sails.helpers.getCharacterPosition(
              existingImagePath,
              "/",
              3
            );
            await sails.helpers.aws.deleteFile(
              existingImagePath.substring(position + 1)
            );
          }

          inputs.avatar = await sails.helpers.aws.uploadFile(
            inputs.avatar,
            "drivers"
          );
        }

        rec["avatar"] = inputs.avatar;
      }
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
        message: sails.config.strings[inputs.admin.language].DRIVER_UPDATED,
      });
    }
    return exits.ok({
      status: false,
      message: sails.config.strings[inputs.admin.language].NOT_FOUND,
      data: [],
    });
  },
};
