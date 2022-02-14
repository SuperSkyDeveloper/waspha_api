const { exists } = require("grunt");

module.exports = {
  friendlyName: "Add or update documents",

  description: "",

  inputs: {
    documents: {
      type: "json",
      required: true,
    },
    id: {
      type: "string",
      required: true,
    },
    role: {
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
      //rec['document'] = await sails.helpers.aws.uploadFile(inputs.document.file,'stores', inputs.document.type);
      let role = inputs.role === global.ROLE.VENDOR ? "store" : inputs.role;
      let all_docs = [];
      let where = {};
      where[`${role}_id`] = inputs.id;
      await sails.models[`${role}_document`].destroy(where);
      inputs.documents.forEach(function (url) {
        let doc = {};
        doc[`${role}_id`] = inputs.id;
        doc["document"] = url;
        all_docs.push(doc);
      });
      await sails.models[`${role}_document`]
        .createEach(all_docs)
        .exec(function createCB(err, created) {
          if (err) {
            sails.log.error(
              `error in attaching subcategory to store,Error: ${err}`
            );
          }
          sails.log("subcategory(s) attached to store", created);
        });
    } catch (err) {}
    return exits.success();
  },
};
