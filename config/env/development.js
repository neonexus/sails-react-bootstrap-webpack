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
    logSensitiveData: false, // never log sensitive data in remote development database

    baseUrl: process.env.BASE_URL || 'https://myapi.app',
    assetsUrl: process.env.ASSETS_URL || '', // Something like: https://my-cdn.app/ must end with / or be blank.

    /***************************************************************************
     * Set the default database connection for models in the development       *
     * environment (see config/datastores.js and config/models.js )           *
     ***************************************************************************/

    datastores: {
        default: {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASS || 'mypass',
            database: process.env.DB_NAME || 'myapp',
            port: process.env.DB_PORT || 3306,
            ssl: (process.env.DB_SSL === 'true')
        }
    },

    models: {
        migrate: 'safe' // This is set as safe, so remote development machines are behaving like remote production machines. Use local.js to override.
    },

    blueprints: {
        shortcuts: false // don't accidentally expose API routes in a remote environment
    }
};
