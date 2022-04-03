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
    logSensitiveData: false, // never log sensitive data in remote development database (for custom request logger hook)

    baseUrl: process.env.BASE_URL || 'https://myapi.app',
    assetsUrl: process.env.ASSETS_URL || '', // Something like: https://my-cdn.app/ must end with / or be blank.

    /***************************************************************************
     * Set the default database connection for models in the development       *
     * environment (see config/datastores.js and config/models.js )           *
     ***************************************************************************/

    datastores: {
        default: {
            host: process.env.DB_HOST || 'localhost',   // To make sure we are on DEV, not PROD, we use shorthand variables, like HOST, not HOSTNAME
            user: process.env.DB_USER || 'root',        // USER, not USERNAME
            password: process.env.DB_PASS || 'mypass',  // PASS, not PASSWORD
            database: process.env.DB_NAME || 'myapp',   // This discrepancy between DEV & PROD environment configuration variables has proven rather useful
            port: process.env.DB_PORT || 3306,
            ssl: (process.env.DB_SSL !== 'false')
        }
    },

    models: {
        // This is set as safe, so remote development machines are behaving like remote production machines.
        // It's also good practice, so one can document any need updates to the schema for PROD prior to deployment.
        // Use local.js to override locally. It is NOT recommended this change for any remote machines.
        migrate: 'safe'
    },

    blueprints: {
        shortcuts: false // don't accidentally expose API routes in a remote environment
    }
};
