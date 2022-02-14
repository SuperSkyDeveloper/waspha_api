module.exports = {
  friendlyName: "Update store credit debit",

  description: "",

  inputs: {
    proposal_id: {
      type: "number",
      required: true,
    },
    store_id: {
      type: "number",
      required: true,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    sails.log("helper update-store-credit-debit started");
    let proposal_id = inputs.proposal_id;
    let store_id = inputs.store_id;
    try {
      let credit_debit = await sails.helpers.vendor.calculateCreditDebit(
        proposal_id
      );

      let store = await Store.findOne({
        where: { id: store_id },
        select: ["credit_amount", "debit_amount"],
      });
      await Store.updateOne({ id: store.id }).set({
        credit_amount: store.credit_amount + credit_debit.credit,
        debit_amount: store.debit_amount + credit_debit.debit,
      });
      sails.log("helper update-store-credit-debit ended");
      return exits.success();
    } catch (err) {
      sails.log(`Error in helper update-store-credit-debit. ${err}`);
      return exits.success(false);
    }
  },
};
