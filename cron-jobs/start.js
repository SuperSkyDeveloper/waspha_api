const moment = require("moment");
module.exports = {
  run: async function (value) {
    await sails.helpers.cron.expireRfps();
    await sails.helpers.cron.expireProposals();
    await sails.helpers.cron.expireDriverOrderRequests();
    await sails.helpers.cron.startQueue();
  },
};

// module.exports = function(value){
//     run = function(){
//         console.log({message:`business logic running every 15 seconds with value: ${value}`, time: moment().format('DD/MM/YYYY HH:mm:ss') });
//     }
// }
