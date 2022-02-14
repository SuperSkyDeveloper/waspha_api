module.exports = {
  friendlyName: "Make payment to vendor",

  description: "",

  inputs: {
    admin: {
      type: "ref",
      required: true,
      description: "Logged in admin",
    },
    store_id: {
      type: "number",
      required: true,
    },
    amount_paid: {
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
  },

  fn: async function (inputs, exits) {
    sails.log("action super-admin/make-payment-to-vendor started");

    try {
      let store = await Store.findOne({
        where: {
          id: inputs.store_id,
        },
        select: ["credit_amount", "debit_amount"],
      });
      if (!store) {
        return exits.ok({
          status: false,
          message: "Unable to update",
          data: [],
        });
      }
      let updated_amount = store.credit_amount - inputs.amount_paid;
      let updated = await Store.updateOne({ id: inputs.store_id }).set({
        credit_amount: updated_amount,
      });
      if (updated) {
        await Store_transaction.create({
          store_id: updated.id,
          admin_id: inputs.admin.id,
          amount_paid: inputs.amount_paid,
        });
      }
      return exits.success({
        status: true,
        message: "Updated",
      });
    } catch (err) {
      sails.log.error(
        `Error in action super-admin/make-payment-to-vendor. ${err}`
      );
    }
  },
};
