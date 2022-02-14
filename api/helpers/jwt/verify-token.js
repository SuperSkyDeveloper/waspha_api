const jwt = require('jsonwebtoken');

const jwtToken = {
  access_token: sails.config.jwt.access_token,
  refresh_token: sails.config.jwt.refresh_token
};
module.exports = {

  friendlyName: 'Verify token',

  description: '',

  inputs: {
    token:{
      type: 'string',
      required: true
    }
  },

  exits: {

    success: {
      description: 'All done.',
    },
    expired: {
      description: 'Given token is expired'
    }

  },

  fn: async function({token}, exits) {
    sails.log.debug('calling helper/jwt/verify');

    try {
      const user = await checkJwt(token);
      // sails.log({user});
      return exits.success(user);
    } catch (e) {
      return exits.expired();
    }
  }

};

function checkJwt(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtToken.access_token, async (err, user) => {
      if (err) {
        sails.log.error({ policyError: err });
        reject(err);
      }
      resolve(user);
    });
  });
}