module.exports = {
  friendlyName: "Attach country",

  description: "",

  inputs: {
    id: {
      type: "number",
      required: true,
    },
    dial_code: {
      type: "string",
      required: true,
    },
    role: {
      type: "string",
      required: true,
    },
    country_code: {
      type: "string",
      required: false,
      allowNull: true,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helper general/attach-country");
    const id = inputs.id;
    const dial_code = inputs.dial_code;
    const role = inputs.role;
    let updated = null;
    let country = null;
    // if (inputs.country_code) {
    //   country = await Country.findOne({ country_code: inputs.country_code });
    // }
    // else {
    country = await Country.findOne({ dial_code: dial_code });
    //   }
    sails.log(`id: ${id}, role: '${role}'`);
    if (country) {
      sails.log(`country found with id ${country.id}`);
      switch (role) {
        case global.ROLE.ADMIN: {
          let admin_country = await Admin_country.find({ admin_id: id }).limit(
            1
          );

          if (admin_country[0]) {
            updated = await Admin_country.updateOne({
              id: admin_country[0].id,
            }).set({ country_id: country.id });
          } else {
            await Admin_country.create({
              admin_id: id,
              country_id: country.id,
            });
          }

          updated = country.currency_code;
          break;
        }
        case global.ROLE.VENDOR: {
          let vendor_country = await Vendor_country.find({
            vendor_id: id,
          }).limit(1);

          if (vendor_country[0]) {
            updated = await Vendor_country.updateOne({
              id: vendor_country[0].id,
            }).set({ country_id: country.id });
          } else {
            await Vendor_country.create({
              vendor_id: id,
              country_id: country.id,
            });
          }

          updated = country.currency_code;
          break;
        }
        case global.ROLE.DRIVER: {
          let driver_country = await Driver_country.find({
            driver_id: id,
          }).limit(1);

          if (driver_country[0]) {
            updated = await Driver_country.updateOne({
              id: driver_country[0].id,
            }).set({ country_id: country.id });
          } else {
            await Driver_country.create({
              driver_id: id,
              country_id: country.id,
            });
          }

          updated = country.currency_code;
          break;
        }
        case global.ROLE.USER: {
          let user_country = await User_country.find({ user_id: id }).limit(1);

          if (user_country[0]) {
            updated = await User_country.updateOne({
              id: user_country[0].id,
            }).set({ country_id: country.id });
          } else {
            await User_country.create({ user_id: id, country_id: country.id });
          }

          updated = country.currency_code;
          break;
        }
      }
    }
    return exits.success(updated);
  },
};
