/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * (for additional recommended settings, see `config/env/production.js`)
 *
 * For more information on configuration, check out:
 * https://sailsjs.com/config/http
 */

module.exports.http = {

    /****************************************************************************
     *                                                                           *
     * Sails/Express middleware to run for every HTTP request.                   *
     * (Only applies to HTTP requests -- not virtual WebSocket requests.)        *
     *                                                                           *
     * https://sailsjs.com/documentation/concepts/middleware                     *
     *                                                                           *
     ****************************************************************************/

    middleware: {

        /***************************************************************************
         *                                                                          *
         * The order in which middleware should be run for HTTP requests.           *
         * (This Sails app's routes are handled by the "router" middleware below.)  *
         *                                                                          *
         ***************************************************************************/

        order: [
            'cookieParser',     // Default HTTP cookie parser.
            // 'session',       // We are using our own custom handling of sessions, via policies and responses.
            'bodyParser',       // Default HTTP request body parser.
            'compress',         // Default HTTP compression handler.
            'customPoweredBy',  // Custom header middleware (found below).
            'router',           // Default route handler (config/routes.js)
            'assetLog',         // Custom middleware to finalize request logs for what is assumed to be assets.
            'www',              // Default hook to serve static files.
            'favicon'           // Default hook to serve favicon.
        ],

        customPoweredBy: (req, res, next) => {
            // Set our own custom "X-Powered-By" header.
            res.set('X-Powered-By', 'Awesome Sauce');

            return next();
        },

        assetLog: async (req, res, next) => {
            await sails.helpers.finalizeRequestLog(req, res, {body: 'asset likely'});

            return next();
        }
    },

    /****************************************************************************************
     *                                                                                      *
     * These are custom configuration options, designed so the `keep-models-safe` helper    *
     * can standardize date formats for you. This also means you can customize how you      *
     * see date data from your API on your local machine, if you were so inclined.          *
     *                                                                                      *
     ****************************************************************************************/
    dateOutput: {
        format: '', // Empty string defaults to ISO-8601.
        tz: 'UTC'   // Timezone coercion.
    }
};
