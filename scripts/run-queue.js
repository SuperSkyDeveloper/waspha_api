module.exports = {


  friendlyName: 'Run queue',


  description: '',


  fn: async function () {

    sails.log('Running custom shell script... (`sails run run-queue`)');
    await sails.helpers.startQueue();   


  }


};

