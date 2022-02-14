module.exports.crontab = {
  /*
   * The asterisks in the key are equivalent to the
   * schedule setting in crontab, i.e.
   * minute hour day month day-of-week year
   * so in the example below it will run every minute
   */

  crons: function () {
    var jsonArray = [];
    let schedule = `*/${process.env.QUEUE_TIME} * * * * *`;
    jsonArray.push({ interval: schedule, method: "start" });

    schedule = `*/${process.env.EXPRESS_DRIVERS_CRON_TIME} * * * * *`;
    jsonArray.push({ interval: schedule, method: "start2" });

    // add more cronjobs if you want like below
    // but dont forget to add a new method…
    //jsonArray.push({interval:'*/1 * * * * * ‘,method:'anothertest'});
    return jsonArray;
  },

  // declare the method start
  // and add it in the crons function
  start: function () {
    require("../cron-jobs/start.js").run("hello");
  },
  start2: function () {
    require("../cron-jobs/start2.js").run("hello");
  },

  /*
    anothertest:function(){
    require(‘../crontab/anothertest.js').run();
    }
    */
};
