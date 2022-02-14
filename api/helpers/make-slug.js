String.prototype.replaceAll = function (str1, str2, ignore) {
  return this.replace(
    new RegExp(
      str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"),
      ignore ? "gi" : "g"
    ),
    typeof str2 == "string" ? str2.replace(/\$/g, "$$$$") : str2
  );
};
module.exports = {
  friendlyName: "Make slug",

  description: "",

  inputs: {
    title: {
      type: "string",
      required: true,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    try {
      let slug = inputs.title.toLowerCase().replaceAll(" ", "-");

      slug = slug.replace(/[^a-zA-Z0-9-]/g, "");

      let initial_slug = slug;
      let i = 2;
      let where = {};
      do {
        where.slug = slug;
        exist = await Category.find({ where: where }).limit(1);
        if (exist.length) {
          slug = initial_slug + "-" + i;
          i++;
        }
      } while (exist.length);

      slug = await sails.helpers.trimString(slug, "| ,:'-");
      sails.log({ slug });
      return exits.success(slug);
    } catch (err) {
      sails.log.error(`Error in helper make-slug. ${err}`);
      return exits.success({});
    }
  },
};
