const moment = require("moment");
module.exports = {
  run: async function (value) {
    await sails.helpers.cron.checkWasphaDriverZones();
    await sails.helpers.cron.getEtaDrivers();
  },
};

// module.exports = function(value){
//     run = function(){
//         console.log({message:`business logic running every 15 seconds with value: ${value}`, time: moment().format('DD/MM/YYYY HH:mm:ss') });
//     }
// }
