const { exec } = require("child_process");
module.exports = {


  friendlyName: 'Run script',


  description: '',


  inputs: {
    script_command: {
      type: 'string',
      required: true
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs, exits) {
    exec(inputs.script_command, (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
      }
      console.log(`stdout: ${stdout}`);
    return exits.success('asher');

    });
    return exits.success(true);

  }


};

