module.exports = {
  friendlyName: "Update driver credit debit",

  description: "",

  inputs: {
    proposal_id: {
      type: "number",
      required: true,
    },
    driver_id: {
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
    sails.log("helper update-driver-credit-debit started");
    let proposal_id = inputs.proposal_id;
    let driver_id = inputs.driver_id;
    try {
      let credit_debit = await sails.helpers.driver.calculateCreditDebit(
        proposal_id,
        driver_id
      );

      let driver = await Driver.findOne({
        where: { id: driver_id },
        select: ["credit_amount", "debit_amount", "total_earning"],
      });
      await Driver.updateOne({ id: driver.id }).set({
        credit_amount: driver.credit_amount + credit_debit.credit,
        debit_amount: driver.debit_amount + credit_debit.debit,
        total_earning: driver.total_earning + credit_debit.total_earning,
      });
      sails.log("helper update-driver-credit-debit ended");
      return exits.success();
    } catch (err) {
      sails.log(`Error in helper update-driver-credit-debit. ${err}`);
      return exits.success(false);
    }
  },
};
