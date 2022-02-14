module.exports = {


  friendlyName: 'Get new user loayalty points',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs, exits) {
    let total_users = await User.count();
    let loyalty_points = 0;
    switch(true){
      case (total_users < 100): {
        loyalty_points = 50;
        break;
      }
      case (total_users >= 100 && total_users < 200): {
        loyalty_points = 20
        break;
      }
    }
    return exits.success(loyalty_points);
  }


};
