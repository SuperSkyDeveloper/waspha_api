const request = require('request');
const { exits } = require('../../controllers/user/social-login');
module.exports = {


  friendlyName: 'Google login',


  description: '',


  inputs: {
    token: {
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
    sails.log("calling helper general/google-login");
    var urlToRq = `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${inputs.token}`;
    // Get information about the google user with the specified access token.
    request.get({url: urlToRq}, function(err, response, body) {
      if(err) {
        sails.log(`error social login using google token, Error: ${err}`)
        return exits.success(false);
      }
      var receivedData = JSON.parse(body);
  
      var userId = receivedData.sub;
      var userEmail = receivedData.email;
      var emailVerified = receivedData.email_verified;
      var userName = receivedData.name;
      var userPicture = receivedData.picture;
  
      if (emailVerified == false) {
        return exits.success(false);
      }
      else {
       // AUTHENTICATION VERIFIED, YOU CAN SAVE THE CONNECTED USER IN A SESSION, OR ADD HIM TO THE DATABASE AS A NEW ACCOUNT, OR CHECK IF HE HAS A PREVIOUS ACCOUNT OR WHATEVER YOU WANT...
       return exits.success(receivedData);
      }
    });
  
  }


};

