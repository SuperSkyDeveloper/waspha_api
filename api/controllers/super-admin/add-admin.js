const bcrypt = require("bcryptjs");
module.exports = {
  friendlyName: "Add admin",

  description: "",

  inputs: {
    admin: {
      type: "ref",
      required: true,
      description: "Logged in admin",
    },
    name: {
      type: "string",
      required: true,
    },
    email: {
      type: "string",
      required: true,
    },
    contact: {
      type: "json",
      required: true,
      custom: function (value) {
        return (
          _.isObject(value) &&
          !_.isUndefined(value.country_code) &&
          //!_.isUndefined(value.phone_number) &&
          !_.isUndefined(value.number)
        );
      },
    },
    password: {
      type: "string",
      required: true,
    },
    country_code: {
      type: "string",
      required: false,
    },
    language: {
      type: "string",
      required: false,
      defaultsTo: "en",
      isIn: ["en", "ar"],
    },
    role_id: {
      type: "number",
      required: true,
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
    invalidRequest: {
      description: "Send invalidRequest response",
      responseType: "invalidRequest",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action super-admin/add-admin");
    sails.log(inputs);

    const strings = sails.config.strings[inputs.admin.language];
    const name = inputs.name;
    const email = inputs.email.toLowerCase();
    const password = inputs.password;
    const contact = inputs.contact.number.replace(/\s/g, "");
    const country_code = inputs.contact.country_code.replace(/\s/g, "");
    const role_id = inputs.role_id;

    admin = await Admin.findOne({ email: email });
    console.log("admin:", admin);
    if (admin && admin.deletedAt == null) {
      sails.log.warn(
        `admin with email ${inputs.email} already exists, returning response`
      );
      // return exits.success({
      //   status: false,
      //   message: strings.EMAIL_ALREADY_EXIST,
      //   data: [],
      // });
      return exits.invalidRequest({
        status: false,
        message: strings.EMAIL_ALREADY_EXIST,
        data: null,
      });
    }
    admin = await Admin.findOne({
      contact: contact,
      country_code: country_code,
    });

    const rec = {
      name: name,
      email: email,
      country_code: country_code,
      contact: contact,
      role_id: role_id,
    };

    if (admin && admin.deletedAt == null) {
      sails.log.warn(
        `admin with contact ${contact} already exists, returning response`
      );
      return exits.invalidRequest({
        status: false,
        message: strings.CONTACT_ALREADY_EXIST,
        data: null,
      });
    } else {
      // delete rec.email;
    }
    //sails.log({admin:admin});return exits.success();
    sails.log(`Encrypting admin password`);
    bcrypt
      .hash(password, 12)
      .then(async (hashedPassword) => {
        sails.log(`Password encrypted, now signing admin up`);
        try {
          rec.password = hashedPassword;
          if (inputs.language) {
            rec.language = inputs.language;
          }

          if (admin) {
            rec.deletedAt = null;
            admin = await Admin.updateOne({ id: admin.id }).set(rec);
          } else {
            admin = await Admin.create(rec).fetch();
          }

          if (admin.id) {
            await sails.helpers.general.attachCountry(
              admin.id,
              admin.country_code,
              global.ROLE.ADMIN
            );
            sails.log(`admin added with email '${inputs.email}'`);
            delete admin.password;

            return exits.success({
              status: true,
              message: strings.ADDED,
              data: admin,
            });
          }
        } catch (err) {
          sails.log.error(`Error in action super-admin/add-admin. ${err}`);
          return exits.serverError(err);
          // …
        }
      })
      .catch((err) => {
        return exits.serverError(err);
      });
  },
};
