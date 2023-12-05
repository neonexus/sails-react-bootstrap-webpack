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
 * For more best-practices and tips, see:
 * https://sailsjs.com/docs/concepts/deployment
 */

module.exports = {
    appName: 'My App',

    baseUrl: process.env.BASE_URL || 'https://myapi.app',
    assetsUrl: process.env.ASSETS_URL || '', // Something like: https://my-cdn.app/ must end with / or be blank.

    /**************************************************************************
     *                                                                         *
     * Tell Sails what database(s) it should use in production.                *
     *                                                                         *
     * (https://sailsjs.com/config/datastores)                                 *
     *                                                                         *
     **************************************************************************/
    datastores: {
        /***************************************************************************
         *                                                                          *
         * Configure your default production database.                              *
         *                                                                          *
         * 1. Choose an adapter:                                                    *
         *    https://sailsjs.com/plugins/databases                                 *
         *                                                                          *
         * 2. Install it as a dependency of your Sails app.                         *
         *    (For example:  npm install sails-mysql --save)                        *
         *                                                                          *
         * 3. Then set it here (`adapter`), along with a connection URL (`url`)     *
         *    and any other, adapter-specific customizations.                       *
         *    (See https://sailsjs.com/config/datastores for help.)                 *
         *                                                                          *
         * 4. NEVER EVER STORE PRODUCTION CREDENTIALS IN THIS FILE!                 *
         *                                                                          *
         ***************************************************************************/
        default: {
            // NEVER EVER STORE PRODUCTION SECURITY CREDENTIALS IN THIS FILE!!!
            // NEVER EVER STORE PRODUCTION SECURITY CREDENTIALS IN THIS FILE!!!
            // NEVER EVER STORE PRODUCTION SECURITY CREDENTIALS IN THIS FILE!!!
            host: process.env.DB_HOSTNAME || 'localhost',                   // To make sure you are
            user: process.env.DB_USERNAME || 'produser',                    // aware of the environment
            password: process.env.DB_PASSWORD || 'prodpass',                // you are configuring,
            database: process.env.DB_NAME || 'prod',                        // you must use HOSTNAME not HOST,
            port: process.env.DB_PORT || 3306,                              // and USERNAME not USER,
            ssl: (process.env.DB_SSL !== 'false')                           // and PASSWORD not PASS.
            // NEVER EVER STORE PRODUCTION SECURITY CREDENTIALS IN THIS FILE!!!
            // NEVER EVER STORE PRODUCTION SECURITY CREDENTIALS IN THIS FILE!!!
            // NEVER EVER STORE PRODUCTION SECURITY CREDENTIALS IN THIS FILE!!!
        }
    },

    models: {

        /***************************************************************************
         *                                                                          *
         * To help avoid accidents, Sails automatically sets the auto-migration     *
         * strategy to "safe" when your app lifts in production mode.               *
         * (This is just here as a reminder.)                                       *
         *                                                                          *
         * More info:                                                               *
         * https://sailsjs.com/docs/concepts/models-and-orm/model-settings#?migrate *
         *                                                                          *
         ***************************************************************************/
        migrate: 'safe', // can not be changed; enforced by Sails

        /***************************************************************************
         *                                                                          *
         * If, in production, this app has access to physical-layer CASCADE         *
         * constraints (e.g. PostgreSQL or MySQL), then set those up in the         *
         * database and uncomment this to disable Waterline's `cascadeOnDestroy`    *
         * polyfill.  (Otherwise, if you are using a database like Mongo, you might *
         * choose to keep this enabled.)                                            *
         *                                                                          *
         ***************************************************************************/
        cascadeOnDestroy: false,

        /**
         *
         * These are the keys used to encrypt data at-rest in our datastore.
         *
         * See: https://sailsjs.com/documentation/concepts/models-and-orm/model-settings#dataencryptionkeys
         *
         */
        dataEncryptionKeys: {
            // Setting as `null` here will prevent the DEK from `models.js` from being used. This is on-purpose and should NOT be changed!
            default: (process.env.DATA_ENCRYPTION_KEY && process.env.DATA_ENCRYPTION_KEY.length && process.env.DATA_ENCRYPTION_KEY !== 'null') ? process.env.DATA_ENCRYPTION_KEY : null
        }
    },

    /**************************************************************************
     *                                                                         *
     * Always disable blueprints.                                              *
     * Blueprints are great development tools, but should NEVER be used in     *
     * PRODUCTION environments because of security concerns.                   *
     *                                                                         *
     ***************************************************************************/
    blueprints: {
        actions: false,
        rest: false,
        shortcuts: false
    },

    /***************************************************************************
     *                                                                          *
     * Configure your security settings for production.                         *
     *                                                                          *
     * IMPORTANT:                                                               *
     * If web browsers will be communicating with your app, be sure that        *
     * you have CSRF protection enabled.  To do that, set `csrf: true` over     *
     * in the `config/security.js` file (not here), so that CSRF app can be     *
     * tested with CSRF protection turned on in development mode too.           *
     *                                                                          *
     ***************************************************************************/
    security: {

        /***************************************************************************
         *                                                                          *
         * If this app has CORS enabled (see `config/security.js`) with the         *
         * `allowCredentials` setting enabled, then you should uncomment the        *
         * `allowOrigins` whitelist below.  This sets which "origins" are allowed   *
         * to send cross-domain (CORS) requests to your Sails app.                  *
         *                                                                          *
         * > Replace "https://example.com" with the URL of your production server.  *
         * > Be sure to use the right protocol!  ("http://" vs. "https://")         *
         *                                                                          *
         ***************************************************************************/
        cors: {
            allRoutes: true,
            // When using `ngrok.js`, it will automatically add the Ngrok URL to allowOrigins.
            allowOrigins: [
                // 'https://my.app',
                // 'https://my-cdn.app',
                'https://prerender.io',
                // 'http://localhost:8080'
            ],
            allowCredentials: true // Allow cookies
        },

        /********************************************************************
         *                                                                  *
         * NEVER log sensitive info in request logs!                        *
         *                                                                  *
         * If the request logger detects NODE_ENV=PRODUCTION, it will       *
         * refuse to log sensitive info, regardless of the settings here,   *
         * or other configuration files. This is a final safeguard, which   *
         * must be manually removed if you MUST log sensitive info, (but    *
         * you NEVER should!!!).                                            *
         *                                                                  *
         * This option is here as a reminder.                               *
         *                                                                  *
         ********************************************************************/
        requestLogger: {
            logSensitiveData: false // Can not be changed.
        }
    },

    session: {

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
            secure: true,
            // This age is when we choose not to use "session" cookies, and want max-age instead.
            maxAge: 24 * 60 * 60 * 1000  // 24 hours
        },

        // npm run generate:token
        secret: (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length && process.env.SESSION_SECRET !== 'null') ? process.env.SESSION_SECRET : null, // DO NOT STORE THIS IN SOURCE CONTROL!
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

        /***************************************************************************
         *                                                                          *
         * Uncomment the `onlyAllowOrigins` whitelist below to configure which      *
         * "origins" are allowed to open socket connections to your Sails app.      *
         *                                                                          *
         * > Replace "https://example.com" etc. with the URL(s) of your app.        *
         * > Be sure to use the right protocol!  ("http://" vs. "https://")         *
         *                                                                          *
         ***************************************************************************/
        onlyAllowOrigins: [
            'https://my.app',
            'https://my-cdn.app'
        ]


        /***************************************************************************
         *                                                                          *
         * If you are deploying a cluster of multiple servers and/or processes,     *
         * then uncomment the following lines.  This tells Socket.io about a Redis  *
         * server it can use to help it deliver broadcasted socket messages.        *
         *                                                                          *
         * > Be sure a compatible version of @sailshq/socket.io-redis is installed! *
         * > (See https://sailsjs.com/config/sockets for the latest version info)   *
         *                                                                          *
         * (https://sailsjs.com/docs/concepts/deployment/scaling)                   *
         *                                                                          *
         ***************************************************************************/
        // adapter: '@sailshq/socket.io-redis',
        // url: 'redis://user:password@bigsquid.redistogo.com:9562/databasenumber',
        //--------------------------------------------------------------------------
        // /\   OR, to avoid checking it in to version control, you might opt to
        // ||   set sensitive credentials like this using an environment variable.
        //
        // For example:
        // ```
        // sails_sockets__url=redis://admin:myc00lpAssw2D@bigsquid.redistogo.com:9562/0
        // ```
        //--------------------------------------------------------------------------

    },


    /**************************************************************************
     *                                                                         *
     * Set the production log level.                                           *
     *                                                                         *
     * (https://sailsjs.com/config/log)                                        *
     *                                                                         *
     ***************************************************************************/
    log: {
        level: 'debug'
    },


    http: {

        /***************************************************************************
         *                                                                          *
         * The number of milliseconds to cache static assets in production.         *
         * (the "max-age" to include in the "Cache-Control" response header)        *
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
        trustProxy: true

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
    // port: 80,


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
        // mailgunDomain: 'mg.example.com',
        // mailgunSecret: 'key-prod_fake_bd32301385130a0bafe030c',
        // stripeSecret: 'sk_prod__fake_Nfgh82401348jaDa3lkZ0d9Hm',
        //--------------------------------------------------------------------------
        // /\   OR, to avoid checking them in to version control, you might opt to
        // ||   set sensitive credentials like these using environment variables.
        //
        // For example:
        // ```
        // sails_custom__mailgunDomain=mg.example.com
        // sails_custom__mailgunSecret=key-prod_fake_bd32301385130a0bafe030c
        // sails_custom__stripeSecret=sk_prod__fake_Nfgh82401348jaDa3lkZ0d9Hm
        // ```
        //--------------------------------------------------------------------------

    },

    autoreload: {
        active: false // Make sure the sails-hook-autoreload never runs on PRODUCTION (shouldn't be installed on PROD anyway).
    }
};
