module.exports = {


  friendlyName: 'Asher',


  description: 'Asher something.',


  fn: async function () {

    sails.log('Running custom shell script... (`sails run sendBulk`)');
    let queue_obj = JSON.stringify({"queue_id":1})
    sails.log({queue_obj});
    sails.log(JSON.parse(queue_obj));
   // return true;
    sails.log(process.argv);
    let args = process.argv;
 //   await sails.helpers.sendPushNotification(21,global.ROLE.USER,'RFP created','Your RFP has been sent to some vendors',false,queue_obj,'rfp_created');
    await sails.helpers.sendPushNotificationBulk(args[4].split(','),args[5],args[6],args[7],args[8] == 'true',args[9],args[10]);

    return true;

  }


};

