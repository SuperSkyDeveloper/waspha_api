/**
 * Production environment settings
 * (sails.config.*)
 *
 * What you see below is a quick outline of the built-in settings you need
 * to configure your Sails app for production.  The configuration in this file
 * is only used in your production environment, i.e. when you lift your app using:
 *
 * ```
 * NODE_ENV=production node app
 * ```
 *
 * > If you're using git as a version control solution for your Sails app,
 * > this file WILL BE COMMITTED to your repository by default, unless you add
 * > it to your .gitignore file.  If your repository will be publicly viewable,
 * > don't add private/sensitive data (like API secrets / db passwords) to this file!
 *
 * For more best practices and tips, see:
 * https://sailsjs.com/docs/concepts/deployment
 */
require("dotenv").config({ path: ".env" });
module.exports = {
  /**************************************************************************
   *                                                                         *
   * Tell Sails what database(s) it should use in production.                *
   *                                                                         *
   * (https://sailsjs.com/config/datastores)                                 *
   *                                                                         *
   **************************************************************************/
  hookTimeout: 100000,
  keepResponseErrors: true,
  datastores: {
    default: {
      adapter: "sails-mysql",
      url: process.env.DATABASE_URL,
      ssl: true,
    },
  },
  jwt: {
    access_token: process.env.JWT_ACCESS_TOKEN,
    refresh_token: process.env.JWT_REFRESH_TOKEN,
  },
  aws: {
    region: process.env.AWS_REGION,
    access_key_id: process.env.AWS_ACCESS_KEY_ID,
    secret_key: process.env.AWS_SECRET_ACCESS_KEY,
    bucket: process.env.AWS_BUCKET,
  },
  fcm: {
    vendor: {
      type: process.env.FCM_VENDOR_TYPE,
      project_id: process.env.FCM_VENDOR_PROJECT_ID,
      private_key_id: process.env.FCM_VENDOR_PRIVATE_KEY_ID,
      private_key: process.env.FCM_VENDOR_PRIVATE_KEY.replace(/\\n/g, "\n"),
      client_email: process.env.FCM_VENDOR_CLIENT_EMAIL,
      client_id: process.env.FCM_VENDOR_CLIENT_ID,
      auth_uri: process.env.FCM_VENDOR_AUTH_URI,
      token_uri: process.env.FCM_VENDOR_TOKEN_URI,
      auth_provider_x509_cert_url:
        process.env.FCM_VENDOR_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.FCM_VENDOR_CLIENT_X509_CERT_URL,
      databaseURL: process.env.FCM_VENDOR_DATABASE_URL,
    },
    user: {
      type: process.env.FCM_USER_TYPE,
      project_id: process.env.FCM_USER_PROJECT_ID,
      private_key_id: process.env.FCM_USER_PRIVATE_KEY_ID,
      private_key: process.env.FCM_USER_PRIVATE_KEY.replace(/\\n/g, "\n"),
      client_email: process.env.FCM_USER_CLIENT_EMAIL,
      client_id: process.env.FCM_USER_CLIENT_ID,
      auth_uri: process.env.FCM_USER_AUTH_URI,
      token_uri: process.env.FCM_USER_TOKEN_URI,
      auth_provider_x509_cert_url:
        process.env.FCM_USER_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.FCM_USER_CLIENT_X509_CERT_URL,
      databaseURL: process.env.FCM_USER_DATABASE_URL,
    },
    driver: {
      type: process.env.FCM_DRIVER_TYPE,
      project_id: process.env.FCM_DRIVER_PROJECT_ID,
      private_key_id: process.env.FCM_DRIVER_PRIVATE_KEY_ID,
      private_key: process.env.FCM_DRIVER_PRIVATE_KEY.replace(/\\n/g, "\n"),
      client_email: process.env.FCM_DRIVER_CLIENT_EMAIL,
      client_id: process.env.FCM_DRIVER_CLIENT_ID,
      auth_uri: process.env.FCM_DRIVER_AUTH_URI,
      token_uri: process.env.FCM_DRIVER_TOKEN_URI,
      auth_provider_x509_cert_url:
        process.env.FCM_DRIVER_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.FCM_DRIVER_CLIENT_X509_CERT_URL,
      databaseURL: process.env.FCM_DRIVER_DATABASE_URL,
    },
  },
  social: {
    vendor: {
      fb: {
        app_id: process.env.FB_APP_ID_VENDOR,
        secret_id: process.env.FB_SECRET_ID_VENDOR,
      },
    },
    user: {
      fb: {
        app_id: process.env.FB_APP_ID_USER,
        secret_id: process.env.FB_SECRET_ID_USER,
      },
    },
  },
  nexmo: {
    api_key: process.env.NEXMO_API_KEY,
    secret_key: process.env.NEXMO_SECRET_KEY,
  },

  mail: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    username: process.env.MAIL_USERNAME,
    password: process.env.MAIL_PASSWORD,
    recepient: process.env.MAIL_RECEPIENT,
  },
  paytabs: {
    merchant_email: process.env.PAYTABS_MERCHANT_EMAIL,
    secret_key: process.env.PAYTABS_SECRET_KEY,
    server_key: process.env.PAYTABS_SERVER_KEY,
    client_key: process.env.PAYTABS_CLIENT_KEY,
    profile_id: process.env.PAYTABS_PROFILE_ID,
  },
  google: {
    api_key: process.env.GOOGLE_API_KEY,
  },
  tracking: {
    url: process.env.TRACKING_SERVER_URL,
  },
  models: {
    migrate: "safe",
    // cascadeOnDestroy: false,
  },

  /**************************************************************************
   *                                                                         *
   * Always disable "shortcut" blueprint routes.                             *
   *                                                                         *
   * > You'll also want to disable any other blueprint routes if you are not *
   * > actually using them (e.g. "actions" and "rest") -- but you can do     *
   * > that in `config/blueprints.js`, since you'll want to disable them in  *
   * > all environments (not just in production.)                            *
   *                                                                         *
   ***************************************************************************/
  blueprints: {
    shortcuts: false,
  },

  security: {
    cors: {
      // allowOrigins: [
      //   'https://example.com',
      // ]
    },
  },

  /***************************************************************************
   *                                                                          *
   * Configure how your app handles sessions in production.                   *
   *                                                                          *
   * (https://sailsjs.com/config/session)                                     *
   *                                                                          *
   * > If you have disabled the "session" hook, then you can safely remove    *
   * > this section from your `config/env/production.js` file.                *
   *                                                                          *
   ***************************************************************************/
  session: {
    /***************************************************************************
     *                                                                          *
     * Production session store configuration.                                  *
     *                                                                          *
     * Uncomment the following lines to finish setting up a package called      *
     * "@sailshq/connect-redis" that will use Redis to handle session data.     *
     * This makes your app more scalable by allowing you to share sessions      *
     * across a cluster of multiple Sails/Node.js servers and/or processes.     *
     * (See http://bit.ly/redis-session-config for more info.)                  *
     *                                                                          *
     * > While @sailshq/connect-redis is a popular choice for Sails apps, many  *
     * > other compatible packages (like "connect-mongo") are available on NPM. *
     * > (For a full list, see https://sailsjs.com/plugins/sessions)            *
     *                                                                          *
     ***************************************************************************/
    // adapter: '@sailshq/connect-redis',
    // url: 'redis://user:password@localhost:6379/databasenumber',
    //--------------------------------------------------------------------------
    // /\   OR, to avoid checking it in to version control, you might opt to
    // ||   set sensitive credentials like this using an environment variable.
    //
    // For example:
    // ```
    // sails_session__url=redis://admin:myc00lpAssw2D@bigsquid.redistogo.com:9562/0
    // ```
    //
    //--------------------------------------------------------------------------

    /***************************************************************************
     *                                                                          *
     * Production configuration for the session ID cookie.                      *
     *                                                                          *
     * Tell browsers (or other user agents) to ensure that session ID cookies   *
     * are always transmitted via HTTPS, and that they expire 24 hours after    *
     * they are set.                                                            *
     *                                                                          *
     * Note that with `secure: true` set, session cookies will _not_ be         *
     * transmitted over unsecured (HTTP) connections. Also, for apps behind     *
     * proxies (like Heroku), the `trustProxy` setting under `http` must be     *
     * configured in order for `secure: true` to work.                          *
     *                                                                          *
     * > While you might want to increase or decrease the `maxAge` or provide   *
     * > other options, you should always set `secure: true` in production      *
     * > if the app is being served over HTTPS.                                 *
     *                                                                          *
     * Read more:                                                               *
     * https://sailsjs.com/config/session#?the-session-id-cookie                *
     *                                                                          *
     ***************************************************************************/
    cookie: {
      // secure: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  },

  /**************************************************************************
   *                                                                          *
   * Set up Socket.io for your production environment.                        *
   *                                                                          *
   * (https://sailsjs.com/config/sockets)                                     *
   *                                                                          *
   * > If you have disabled the "sockets" hook, then you can safely remove    *
   * > this section from your `config/env/production.js` file.                *
   *                                                                          *
   ***************************************************************************/
  sockets: {
    onlyAllowOrigins: [
      "https://waspha-staging.herokuapp.com",
      "https://waspha-production.herokuapp.com",
    ],
  },

  /**************************************************************************
   *                                                                         *
   * Set the production log level.                                           *
   *                                                                         *
   * (https://sailsjs.com/config/log)                                        *
   *                                                                         *
   ***************************************************************************/
  log: {
    level: "debug",
  },

  http: {
    /***************************************************************************
     *                                                                          *
     * The number of milliseconds to cache static assets in production.         *
     * (the "max-age" to include in the "Cache-Control" response header)        *
     *                                                                          *
     * If you are caching assets with a tool like Cloudflare, you may want to   *
     * reduce this considerably to allow more flexibility in purging the cache. *
     *                                                                          *
     ***************************************************************************/
    cache: 365.25 * 24 * 60 * 60 * 1000, // One year

    /***************************************************************************
     *                                                                          *
     * Proxy settings                                                           *
     *                                                                          *
     * If your app will be deployed behind a proxy/load balancer - for example, *
     * on a PaaS like Heroku - then uncomment the `trustProxy` setting below.   *
     * This tells Sails/Express how to interpret X-Forwarded headers.           *
     *                                                                          *
     * This setting is especially important if you are using secure cookies     *
     * (see the `cookies: secure` setting under `session` above) or if your app *
     * relies on knowing the original IP address that a request came from.      *
     *                                                                          *
     * (https://sailsjs.com/config/http)                                        *
     *                                                                          *
     ***************************************************************************/
    trustProxy: true,
  },

  /**************************************************************************
   *                                                                         *
   * Lift the server on port 80.                                             *
   * (if deploying behind a proxy, or to a PaaS like Heroku or Deis, you     *
   * probably don't need to set a port here, because it is oftentimes        *
   * handled for you automatically.  If you are not sure if you need to set  *
   * this, just try deploying without setting it and see if it works.)       *
   *                                                                         *
   ***************************************************************************/
  //port: process.env.PORT || 1337,

  /**************************************************************************
   *                                                                         *
   * Configure an SSL certificate                                            *
   *                                                                         *
   * For the safety of your users' data, you should use SSL in production.   *
   * ...But in many cases, you may not actually want to set it up _here_.    *
   *                                                                         *
   * Normally, this setting is only relevant when running a single-process   *
   * deployment, with no proxy/load balancer in the mix.  But if, on the     *
   * other hand, you are using a PaaS like Heroku, you'll want to set up     *
   * SSL in your load balancer settings (usually somewhere in your hosting   *
   * provider's dashboard-- not here.)                                       *
   *                                                                         *
   * > For more information about configuring SSL in Sails, see:             *
   * > https://sailsjs.com/config/*#?sailsconfigssl                          *
   *                                                                         *
   **************************************************************************/
  // ssl: undefined,

  /**************************************************************************
   *                                                                         *
   * Production overrides for any custom settings specific to your app.      *
   * (for example, production credentials for 3rd party APIs like Stripe)    *
   *                                                                         *
   * > See config/custom.js for more info on how to configure these options. *
   *                                                                         *
   ***************************************************************************/
  custom: {
    baseUrl: process.env.BASE_URL,
    returnUrl: process.env.RETURN_URL,
    internalEmailAddress: "support@example.com",

    // sendgridSecret: 'SG.fake.3e0Bn0qSQVnwb1E4qNPz9JZP5vLZYqjh7sn8S93oSHU',
    // stripeSecret: 'sk_prod__fake_Nfgh82401348jaDa3lkZ0d9Hm',
    //--------------------------------------------------------------------------
    // /\   OR, to avoid checking them in to version control, you might opt to
    // ||   set sensitive credentials like these using environment variables.
    //
    // For example:
    // ```
    // sendgridSecret=SG.fake.3e0Bn0qSQVnwb1E4qNPz9JZP5vLZYqjh7sn8S93oSHU
    // sails_custom__stripeSecret=sk_prod__fake_Nfgh82401348jaDa3lkZ0d9Hm
    // ```
    //--------------------------------------------------------------------------
  },
};
