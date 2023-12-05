/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {
    appName: 'My App (DEV)',

    baseUrl: process.env.BASE_URL || 'https://myapi.app',
    assetsUrl: process.env.ASSETS_URL || '', // Something like: https://my-cdn.app/ must end with / or be blank.

    /***************************************************************************
     * Set the default database connection for models in the development       *
     * environment (see config/datastores.js and config/models.js )           *
     ***************************************************************************/

    datastores: {
        default: {
            host: process.env.DB_HOST || 'localhost',   // To make sure we are on DEV, not PROD, we use shorthand variables, like DB_HOST, not DB_HOSTNAME,
            user: process.env.DB_USER || 'root',        // DB_USER, not DB_USERNAME
            password: process.env.DB_PASS || 'mypass',  // DB_PASS, not DB_PASSWORD
            database: process.env.DB_NAME || 'myapp',   // This discrepancy between DEV & PROD environment configuration variables has proven rather useful.
            port: process.env.DB_PORT || 3306,
            ssl: (process.env.DB_SSL !== 'false')
        }
    },

    models: {
        // This is set as safe, so remote development machines are behaving like remote production machines.
        // It's also good practice, so one can document any needed updates to the schema for PROD prior to deployment.
        // Use local.js to override locally. It is NOT recommended this change for any remote machines.
        migrate: 'safe',

        dataEncryptionKeys: {
            // Setting as 'undefined' will fall back to the DEK defined in `models.js`.
            default: (process.env.DATA_ENCRYPTION_KEY && process.env.DATA_ENCRYPTION_KEY.length && process.env.DATA_ENCRYPTION_KEY !== 'null') ? process.env.DATA_ENCRYPTION_KEY : undefined
        }
    },

    // Disable all blueprint features.
    // These are great tools for quick development, but
    // this repo is already built with explicit actions, and routes.
    // To prevent confusion / security issues down the line, just disable them all.
    blueprints: {
        actions: false,
        routes: false,
        shortcuts: false
    },

    security: {
        /********************************************************************
         *                                                                  *
         * This is a custom configuration option, for the request logger    *
         * hook (api/hook/request-logger.js) and the finalize request log   *
         * helper (api/helpers/finalize-request-log.js).                    *
         *                                                                  *
         * If for some reason you need to debug sensitive info in your      *
         * request logs, you can set this to `true`. Will ALWAYS be `false` *
         * on PRODUCTION environments.                                      *
         *                                                                  *
         ********************************************************************/
        requestLogger: {
            logSensitiveData: false
        }
    },

    session: {
        secret: (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length && process.env.SESSION_SECRET !== 'null') ? process.env.SESSION_SECRET : undefined,
    }
};
