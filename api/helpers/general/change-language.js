module.exports = {
  friendlyName: "Change language",

  description: "",

  inputs: {
    id: {
      type: "number",
      required: true,
    },
    language: {
      type: "string",
      required: true,
      isIn: ["en", "ar"],
    },
    role: {
      type: "string",
      required: true,
      isIn: ["admin", "vendor", "driver", "user"],
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling helpers/change-language");

    const id = inputs.id;
    const language = inputs.language;
    const role = inputs.role;
    let updated = false;

    switch (role) {
      case "admin": {
        await Admin.updateOne({ id: id }).set({ language: language });
        updated = true;
        break;
      }
      case "vendor": {
        updated = await Vendor.updateOne({ id: id }).set({
          language: language,
        });

        updated = true;
        break;
      }
      case "driver": {
        await Driver.updateOne({ id: id }).set({ language: language });
        updated = true;
        break;
      }
      case "user": {
        await User.updateOne({ id: id }).set({ language: language });
        updated = true;
        break;
      }
    }
    return exits.success(updated);
  },
};
