const bcrypt = require("bcryptjs");

async function createRecordObj(inputs) {
  const contact = inputs.contact.number.replace(/\s/g, "");
  const country_code = inputs.contact.country_code.replace(/\s/g, "");
  let rec = { contact: contact, country_code: country_code };
  if (inputs.name) {
    rec["name"] = inputs.name;
  }
  if (inputs.email) {
    rec["email"] = inputs.email;
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

  if (inputs.avatar) {
    // rec["avatar"] = await sails.helpers.aws.uploadFile(
    //   inputs.avatar,
    //   "drivers"
    // );
    rec["avatar"] = inputs.avatar;
  }
  if (inputs.store_id) {
    rec["store_id"] = inputs.store_id;
  }
  rec["status"] = true;

  rec["type"] = inputs.type;

  return rec;
}
module.exports = {
  friendlyName: "Add driver admin",

  description: "",

  inputs: {
    admin: {
      type: "ref",
      required: true,
      description: "logged in admin",
    },
    store_id: {
      type: "number",
      required: false,
    },
    name: {
      type: "string",
      required: true,
    },
    email: {
      type: "string",
      required: false,
    },
    contact: {
      type: "json",
      required: true,
      custom: function (value) {
        return (
          _.isObject(value) &&
          !_.isUndefined(value.country_code) &&
          //&& !_.isUndefined(value.phone_number)
          !_.isUndefined(value.number)
        );
      },
    },
    password: {
      type: "string",
      required: false,
    },
    vehicle_id: {
      type: "number",
      custom: async function (value) {
        return true;
        let result = await sails.helpers.general.entityExists(
          value,
          "delivery_vehicle"
        );
        result != null ? true : false;
        Promise.resolve(result);
      },
    },
    vehicle_name: {
      type: "string",
      required: false,
    },
    number_plate: {
      type: "string",
      required: false,
    },
    type: {
      type: "string",
      required: false,
      isIn: ["online", "offline", "waspha_express"],
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
    sails.log("calling action super-admin/add-driver");
    console.log(inputs);
    // return exits.success();
    if (inputs.is_online === true) {
      if (!(inputs.email && inputs.password)) {
        return exits.ok({
          status: false,
          data: [],
          message:
            sails.config.strings[inputs.admin.language]
              .EMAIL_PASSWORD_REQUIRED_FOR_ONLINE_DRIVER,
        });
      } else {
        driver = await Driver.findOne({ email: inputs.email });
        // console.log("driver:",driver)
        if (driver) {
          sails.log.warn(
            `driver with email ${inputs.email} already exists, returning response`
          );
          return exits.success({
            status: false,
            data: [],
            message:
              sails.config.strings[inputs.admin.language]
                .EMAIL_ALREADY_EXIST_DRIVER,
          });
        }
      }
    }
    const contact = inputs.contact.number.replace(/\s/g, "");
    const country_code = inputs.contact.country_code.replace(/\s/g, "");

    driver = await Driver.findOne({
      contact: contact,
      country_code: country_code,
    });
    if (driver) {
      sails.log.warn(
        `driver with contact ${contact} & country_code ${country_code} already exists, returning response`
      );
      return exits.success({
        status: false,
        data: [],
        message:
          sails.config.strings[inputs.admin.language]
            .CONTACT_ALREADY_EXIST_DRIVER,
      });
    }
    const rec = await createRecordObj(inputs);
    if (inputs.password) {
      sails.log(`Encrypting driver password`);
      bcrypt
        .hash(inputs.password, 12)
        .then(async (hashedPassword) => {
          sails.log(`Password encrypted, now adding driver`);
          try {
            rec["password"] = hashedPassword;
            const driver = await Driver.create(rec).fetch();
            if (driver.id) {
              await sails.helpers.general.attachCountry(
                driver.id,
                driver.country_code,
                global.ROLE.DRIVER
              );
              sails.log(`driver added with email '${inputs.email}'`);
              delete driver.password;

              return exits.success({
                status: true,
                data: driver,
                message:
                  sails.config.strings[inputs.admin.language].DRIVER_ADDED,
              });
            }

            return exits.ok({
              status: false,
              message:
                sails.config.strings[inputs.admin.language]
                  .UNABLE_TO_ADD_DRIVER,
              data: [],
            });
          } catch (err) {
            sails.log.error(
              `Error adding driver for store id ${inputs.store_id}. ${err}`
            );
            return exits.serverError({
              status: false,
              message:
                sails.config.strings[inputs.admin.language]
                  .UNABLE_TO_ADD_DRIVER,
              data: [],
            });
          }
        })
        .catch((err) => {
          sails.log.error(
            `Error adding driver for store id ${inputs.store_id}. ${err}`
          );
          return exits.serverError({
            status: false,
            message:
              sails.config.strings[inputs.admin.language].UNABLE_TO_ADD_DRIVER,
            data: [],
          });
        });
    } else {
      const driver = await Driver.create(rec).fetch();
      if (driver.id) {
        sails.log(`driver added with email '${inputs.email}'`);
        delete driver.password;

        await sails.helpers.general.attachCountry(
          driver.id,
          driver.country_code,
          global.ROLE.DRIVER
        );
        return exits.success({
          status: true,
          message: sails.config.strings[inputs.admin.language].DRIVER_ADDED,
          data: driver,
        });
      }

      return exits.ok({
        status: false,
        message:
          sails.config.strings[inputs.admin.language].UNABLE_TO_ADD_DRIVER,
        data: [],
      });
    }
  },
};
