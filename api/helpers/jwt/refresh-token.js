const jwt = require('jsonwebtoken');
const uuidv1 = require('uuid/v1');

const jwtToken = {
  access_token: sails.config.jwt.access_token,
  refresh_token: sails.config.jwt.refresh_token
};

module.exports = {

  friendlyName: 'Refresh token',

  description: 'To refresh token when expired. provided by refresh token by client',

  inputs: {
    token: {
      type: 'string',
      required: true
    },
    role: {
      type: 'string',
      isIn: ['user','admin','vendor', 'driver'],
      defaultsTo: 'user'
    }

  },

  exits: {

    success: {
      description: 'All done.',
    },
    invalid: {
      description: 'invalid token given'
    },
    invalidUser: {
      description: 'invalid user'

    }
  },

  fn: async function({ token: refreshToken, role }, exits) {
    sails.log.debug('calling helpers/jwt/refresh-token');
    const token = await Token.find({ token: refreshToken }).limit(1);
    if (token.length < 1) return exits.invalid();

    jwt.verify(refreshToken, jwtToken.refresh_token, async (err, user) => {
      if (err) {
        sails.log.error('Error verify refresh token ', err);
        return exits.invalid();
      }
      try {
        // await sails.helpers.jwt.removeToken.with({ token: refreshToken });
        sails.log({ jwt: user});
        let dbuser = {};
        switch (role) {
        case 'admin':
          dbuser = await Admin.find({id: user.id}).limit(1);
          break;
        case 'vendor':
          dbuser = await Vendor.find({id: user.id}).limit(1);
          break;
        case 'driver':
          dbuser = await Driver.find({id: user.id}).limit(1);
          break;
        default:
          dbuser = await User.find({id: user.id}).limit(1);
        }
        if (dbuser.length < 1) exits.invalidUser();
        
        dbuser = await sails.helpers.jwt.generateToken.with({ user: { ...dbuser[0] }, needRefreshToken: false });

        // const accessToken = await sails.helpers.jwt.accessToken.with({ payload: user });
        // const newRefreshToken = jwt.sign(user, jwtToken.refresh_token);
        // remove prev refresh token
        return exits.success({ access_token: dbuser.access_token, refresh_token: refreshToken });
      } catch (e) {
        sails.log.error('Error creating token', e);
        return exits.invalid();
      }
    });
  }

};

