module.exports = {


  friendlyName: 'Test',


  description: 'Test something.',


  fn: async function () {

    sails.log('Running custom shell script... (`sails run test`)');
    let args = process.argv;
    await sails.helpers.sendPushNotification(args[4],args[5],args[6],args[7],args[8] == 'true',args[9],args[10]);

  }


};

