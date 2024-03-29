/**
 * Datastores
 * (sails.config.datastores)
 *
 * A set of datastore configurations which tell Sails where to fetch or save
 * data when you execute built-in model methods like `.find()` and `.create()`.
 *
 *  > This file is mainly useful for configuring your development database,
 *  > as well as any additional one-off databases used by individual models.
 *  > Ready to go live?  Head towards `config/env/production.js`.
 *
 * For more information on configuring datastores, check out:
 * https://sailsjs.com/config/datastores
 */

module.exports.datastores = {
    /***************************************************************************
     *                                                                          *
     * Your app's default datastore.                                            *
     *                                                                          *
     * Sails apps read and write to local disk by default, using a built-in     *
     * database adapter called `sails-disk`.  This feature is purely for        *
     * convenience during development; since `sails-disk` is not designed for   *
     * use in a production environment.                                         *
     *                                                                          *
     * To use a different db _in development_, follow the directions below.     *
     * Otherwise, just leave the default datastore as-is, with no `adapter`.    *
     *                                                                          *
     * (For production configuration, see `config/env/production.js`.)          *
     *                                                                          *
     ***************************************************************************/

    default: {

        /***************************************************************************
         *                                                                          *
         * Want to use a different database during development?                     *
         *                                                                          *
         * 1. Choose an adapter:                                                    *
         *    https://sailsjs.com/plugins/databases                                 *
         *                                                                          *
         * 2. Install it as a dependency of your Sails app.                         *
         *    (For example:  npm install sails-mysql --save)                        *
         *                                                                          *
         * 3. Then pass it in, along with a connection URL.                         *
         *    (See https://sailsjs.com/config/datastores for help.)                 *
         *                                                                          *
         *                                                                          *
         * NOTE: These settings are often overwritten in `local.js`, or the remote  *
         * environment configs: `env/development.js` or `env/production.js`.        *
         *                                                                          *
         * NEVER STORE SECURITY CREDENTIALS IN GIT-CONTROLLED FILES!!!              *
         *                                                                          *
         ***************************************************************************/
        adapter: 'sails-mysql',
        // url: 'mysql://user:password@host:port/database',

        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || 'mypass',
        database: process.env.DB_NAME || 'myapp',
        port: process.env.DB_PORT || 3306,
        ssl: true,

        // These are good settings to standardize across environments,
        // and should generally only be set in this file.
        charset: 'utf8mb4',
        collation: 'utf8mb4_general_ci',
        timezone: 'UTC'
    }
};
