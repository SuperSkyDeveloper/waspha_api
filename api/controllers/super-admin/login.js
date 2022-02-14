const bcrypt = require("bcryptjs");
module.exports = {
  friendlyName: "Login",

  description: "Login admin.",

  inputs: {
    email: {
      type: "string",
      required: true,
    },
    password: {
      type: "string",
      required: true,
    },
  },
  exits: {
    invalid: {
      responseType: "unauthorized",
      description: "Send 401 if authentication failed",
    },
    unauthorized: {
      responseType: "unauthorized",
      description: "Send 401 if authentication failed",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action admin/login");
    const email = inputs.email.toLowerCase();
    const password = inputs.password;
    let loadedadmin;
    Admin.findOne({ email: email })
      .populate("role_id")
      .then((admin) => {
        console.log("admin is:", admin);
        if (!admin) {
          sails.log.warn(`admin has entered the invalid email`);
          return exits.invalid({
            status: false,
            data: [],
            message: "Email or password not correct",
          });
        }
        loadedadmin = admin;
        return bcrypt.compare(password.toString(), admin.password);
      })
      .then(async (isEqual) => {
        if (!isEqual) {
          sails.log.warn(
            `admin_id ${loadedadmin.id} has entered the wrong password`
          );

          return exits.invalid({
            status: false,
            data: [],
            message: "Email or password not correct",
          });
        }

        admin = await sails.helpers.jwt.generateToken.with({
          user: { ...loadedadmin },
        });
        admin.country = await sails.helpers.general.getCountry(
          admin.id,
          global.ROLE.ADMIN
        );
        admin.country = admin.country.country_code;
        admin.role = admin.role_id.name;
        delete admin.role_id;
        delete admin.password;
        return exits.success({
          status: true,
          data: admin,
          message: "Logged in successfully",
        });
      })
      .catch((err) => {
        sails.log.error(`Error in action super-admin/login.${err}`);
        if (!err.statusCode) {
          err.statusCode = 500;
        }
      });
  },
};
