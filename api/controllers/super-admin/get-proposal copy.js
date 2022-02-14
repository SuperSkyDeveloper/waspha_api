module.exports = {
  friendlyName: "Get proposal",

  description: "",

  inputs: {
    id: {
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
    notFound: {
      description: "Send notFound response",
      responseType: "notFound",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("calling action admin/get-proposal");
    let proposal = await Proposal.findOne({ id: inputs.id })
      // .populate("subcategory_id")
      .populate("rfp_store_id")
      .populate("status_id")
      .populate("rfp_store_id")
      .then(function (post) {
        sails.log({ post0: post });
        var commentUsers = Request_for_proposal.find({
          id: _.pluck(post.rfp_store_id.rfp_id, "id"),
          //_.pluck: Retrieves the value of a 'user' property from all elements in the post.comments collection.
        }).then(function (commentUser) {
          sails.log({ commentUsers0: commentUser });
          return commentUser;
        });
        sails.log({ commentUsers1: commentUsers });
        return [post, commentUsers];
      })
      .spread(function (post, commentUsers) {
        sails.log({ commentUsers2: commentUsers });
        commentUsers = _.indexBy(commentUsers, "id");

        //_.indexBy: Creates an object composed of keys generated from the results of running each element of the collection through the given callback. The corresponding value of each key is the last element responsible for generating the key
        post.rfp_new = _.map(post.rfp_id, function (comment) {
          comment.user = commentUsers[comment.user_id];
          return comment;
        });
        //res.json(post);
      })
      .catch(function (err) {
        sails.log(`Error in action get-proposal. ${err}`);
        return exits.serverError(err);
      });

    sails.log({ proposal: proposal });
    return;
    proposal.category = {};
    proposal.category.name = proposal.subcategory_id.name;
    delete proposal.subcategory_id;
    proposal.user = {};
    proposal.user.name = proposal.user_id.name;
    delete proposal.user_id;
    proposal.status = proposal.status_id.description;
    delete proposal.status_id;
    return exits.success({
      status: true,
      message: "proposal found successfully",
      data: proposal,
    });
  },
};
