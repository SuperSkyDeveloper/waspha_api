const { exec } = require("child_process");
module.exports = {
  friendlyName: "Send notification",

  description: "",

  inputs: {},

  exits: {},

  fn: async function (inputs, exits) {
    sails.log("calling action test/send-notification");

    // let script_str = `sails run testScript 1 'vendor' 'test from script' 'Test From Script' false '${JSON.stringify({id:1})}' 'test_noti'`;
    // exec(script_str, (error, stdout, stderr) => {
    //   if (error) {
    //       console.log(`error: ${error.message}`);
    //       return;
    //   }
    //   if (stderr) {
    //       console.log(`stderr: ${stderr}`);
    //       return;
    //   }
    //   console.log(`stdout: ${stdout}`);
    // return exits.success('asher');

    // });
    await sails.helpers.sendPushNotification(
      465,
      "vendor",
      "Test",
      "Test noti",
      false,
      JSON.stringify({ id: 1 }),
      "test_noti"
    );
    return exits.success(1);
  },
};
